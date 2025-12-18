import { NextRequest, NextResponse } from 'next/server';
import { desc, eq, and, gte, lte } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { events, users, projects, leads, processInstances } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['admin']);
    const db = getDb();

    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const type = searchParams.get('type');
    const userId = searchParams.get('user');
    const entity = searchParams.get('entity');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build filters
    const filters: any[] = [];

    if (type) {
      filters.push(eq(events.type, type));
    }

    if (userId) {
      filters.push(eq(events.actorUserId, userId));
    }

    if (entity) {
      if (entity === 'lead') {
        filters.push(eq(events.leadId, events.leadId));
      } else if (entity === 'project') {
        filters.push(eq(events.projectId, events.projectId));
      } else if (entity === 'instance') {
        filters.push(eq(events.instanceId, events.instanceId));
      }
    }

    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) {
        filters.push(gte(events.createdAt, fromDate));
      }
    }

    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) {
        filters.push(lte(events.createdAt, toDate));
      }
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // Fetch all matching logs (limit to 10000 for export)
    const auditLogs = await db
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
      .limit(10000)
      .all();

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Timestamp',
        'Event Type',
        'Actor Name',
        'Actor Email',
        'Project',
        'Lead',
        'Instance',
        'Payload',
      ];

      const rows = auditLogs.map(({ event, actor, project, lead, instance }) => [
        new Date(event.createdAt).toISOString(),
        event.type,
        actor?.name || '',
        actor?.email || '',
        project?.name || '',
        lead?.name || '',
        instance?.id || '',
        JSON.stringify(event.payloadJson || {}),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`,
        },
      });
    } else {
      // Generate JSON
      const jsonData = auditLogs.map(({ event, actor, project, lead, instance }) => ({
        id: event.id,
        timestamp: new Date(event.createdAt).toISOString(),
        type: event.type,
        actor: actor
          ? {
              id: actor.id,
              name: actor.name,
              email: actor.email,
            }
          : null,
        entity: {
          project: project ? { id: project.id, name: project.name } : null,
          lead: lead ? { id: lead.id, name: lead.name } : null,
          instance: instance ? { id: instance.id, status: instance.status } : null,
        },
        payload: event.payloadJson,
      }));

      return NextResponse.json(
        {
          count: jsonData.length,
          exportedAt: new Date().toISOString(),
          data: jsonData,
        },
        {
          headers: {
            'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.json"`,
          },
        }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
