import { NextRequest, NextResponse } from 'next/server';
import { desc, gte, eq, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { events, users } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['admin']);
    const db = getDb();

    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    const last15Minutes = new Date(now.getTime() - 15 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get recent events count
    const [
      recentEvents,
      last5MinCount,
      last15MinCount,
      lastHourCount,
      last24HoursCount,
      eventTypeCounts,
      activeUsers,
    ] = await Promise.all([
      // Get latest 10 events
      db
        .select({
          event: events,
          actor: users,
        })
        .from(events)
        .leftJoin(users, eq(events.actorUserId, users.id))
        .orderBy(desc(events.createdAt))
        .limit(10)
        .all(),

      // Event counts by time period
      db
        .select({ count: events.id })
        .from(events)
        .where(gte(events.createdAt, last5Minutes))
        .all()
        .then((r) => r.length),

      db
        .select({ count: events.id })
        .from(events)
        .where(gte(events.createdAt, last15Minutes))
        .all()
        .then((r) => r.length),

      db
        .select({ count: events.id })
        .from(events)
        .where(gte(events.createdAt, lastHour))
        .all()
        .then((r) => r.length),

      db
        .select({ count: events.id })
        .from(events)
        .where(gte(events.createdAt, last24Hours))
        .all()
        .then((r) => r.length),

      // Event type distribution (last 24 hours)
      db
        .select({
          type: events.type,
        })
        .from(events)
        .where(gte(events.createdAt, last24Hours))
        .all()
        .then((results) => {
          const counts = new Map<string, number>();
          results.forEach((r) => {
            counts.set(r.type, (counts.get(r.type) || 0) + 1);
          });
          return Array.from(counts.entries())
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }),

      // Active users (last hour)
      db
        .select({
          userId: events.actorUserId,
          userName: users.name,
          userEmail: users.email,
        })
        .from(events)
        .leftJoin(users, eq(events.actorUserId, users.id))
        .where(gte(events.createdAt, lastHour))
        .all()
        .then((results) => {
          const userMap = new Map<
            string,
            { id: string; name: string | null; email: string; count: number }
          >();
          results.forEach((r) => {
            if (r.userId) {
              const existing = userMap.get(r.userId);
              if (existing) {
                existing.count++;
              } else {
                userMap.set(r.userId, {
                  id: r.userId,
                  name: r.userName,
                  email: r.userEmail || '',
                  count: 1,
                });
              }
            }
          });
          return Array.from(userMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }),
    ]);

    // Calculate rates (events per minute)
    const ratePerMinute = {
      last5Minutes: last5MinCount / 5,
      last15Minutes: last15MinCount / 15,
      lastHour: lastHourCount / 60,
      last24Hours: last24HoursCount / 1440,
    };

    return NextResponse.json({
      timestamp: now.toISOString(),
      stats: {
        last5Minutes: last5MinCount,
        last15Minutes: last15MinCount,
        lastHour: lastHourCount,
        last24Hours: last24HoursCount,
      },
      rates: ratePerMinute,
      recentEvents: recentEvents.map(({ event, actor }) => ({
        id: event.id,
        type: event.type,
        timestamp: event.createdAt,
        actor: actor
          ? {
              name: actor.name,
              email: actor.email,
            }
          : null,
      })),
      topEventTypes: eventTypeCounts,
      activeUsers: activeUsers,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit stats' },
      { status: 500 }
    );
  }
}
