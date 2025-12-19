import { desc, eq, and, gte, lte, isNotNull, sql, asc } from 'drizzle-orm';

import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { events, users, projects, leads, processInstances } from '@/lib/db/schema';
import AuditLogClient from './AuditLogClient';

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    type?: string;
    user?: string;
    entity?: string;
    from?: string;
    to?: string;
    search?: string;
  }>;
}) {
  await requireRole(['admin']);
  const db = getDb();
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page ?? '1') || 1);
  const limit = 50;
  const offset = (currentPage - 1) * limit;

  const type = (params.type ?? '').trim();
  const user = (params.user ?? '').trim();
  const entity = (params.entity ?? '').trim();
  const from = (params.from ?? '').trim();
  const to = (params.to ?? '').trim();
  const search = (params.search ?? '').trim();

  const baseFilters: any[] = [];

  if (type) baseFilters.push(eq(events.type, type));
  if (user) baseFilters.push(eq(events.actorUserId, user));

  if (entity === 'lead') baseFilters.push(isNotNull(events.leadId));
  if (entity === 'project') baseFilters.push(isNotNull(events.projectId));
  if (entity === 'instance') baseFilters.push(isNotNull(events.instanceId));

  if (search) {
    const pattern = `%${search}%`;
    baseFilters.push(sql`(${events.type} LIKE ${pattern} OR ${events.payloadJson} LIKE ${pattern})`);
  }

  const listFilters = [...baseFilters];

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) listFilters.push(gte(events.createdAt, fromDate));
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) listFilters.push(lte(events.createdAt, toDate));
  }

  const whereClause = listFilters.length ? and(...listFilters) : undefined;

  const rows = await db
    .select({
      event: events,
      actor: users,
      project: projects,
      lead: leads,
      instance: processInstances,
    })
    .from(events)
    .leftJoin(users, eq(events.actorUserId, users.id))
    .leftJoin(projects, eq(events.projectId, projects.id))
    .leftJoin(leads, eq(events.leadId, leads.id))
    .leftJoin(processInstances, eq(events.instanceId, processInstances.id))
    .where(whereClause)
    .orderBy(desc(events.createdAt))
    .limit(limit + 1)
    .offset(offset)
    .all();

  const hasMore = rows.length > limit;
  const logs = (hasMore ? rows.slice(0, limit) : rows).map((r) => ({
    event: r.event,
    actor: r.actor
      ? {
          id: r.actor.id,
          name: r.actor.name,
          email: r.actor.email,
          image: r.actor.image,
        }
      : null,
    project: r.project ? { id: r.project.id, name: r.project.name } : null,
    lead: r.lead ? { id: r.lead.id, name: r.lead.name } : null,
    instance: r.instance ? { id: r.instance.id, status: r.instance.status } : null,
  }));

  const eventTypeRows = await db
    .select({ type: events.type })
    .from(events)
    .groupBy(events.type)
    .orderBy(asc(events.type))
    .all();

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .orderBy(asc(users.email))
    .all();

  const baseWhere = baseFilters.length ? and(...baseFilters) : undefined;
  const now = Date.now();
  const last24 = new Date(now - 24 * 60 * 60 * 1000);
  const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [totalRow, last24Row, last7Row] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(events).where(whereClause).get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(baseWhere ? and(baseWhere, gte(events.createdAt, last24)) : gte(events.createdAt, last24))
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(baseWhere ? and(baseWhere, gte(events.createdAt, last7)) : gte(events.createdAt, last7))
      .get(),
  ]);

  const stats = {
    total: totalRow?.count ?? 0,
    last24Hours: last24Row?.count ?? 0,
    last7Days: last7Row?.count ?? 0,
  };

  return (
    <AuditLogClient
      logs={logs as any}
      eventTypes={eventTypeRows.map((r) => r.type)}
      users={userRows}
      stats={stats}
      currentPage={currentPage}
      hasMore={hasMore}
      filters={{
        type,
        user,
        entity,
        from,
        to,
        search,
      }}
    />
  );
}
