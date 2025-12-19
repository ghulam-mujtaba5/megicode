
import { getDb } from '@/lib/db';
import { tasks, milestones, userAvailability, meetings, users } from '@/lib/db/schema';
import { requireInternalSession } from '@/lib/internal/auth';
import CalendarClient from './CalendarClient';
import { desc } from 'drizzle-orm';

export default async function CalendarPage() {
  await requireInternalSession();
  const db = getDb();

  // Fetch all data in parallel
  const [
    tasksData,
    milestonesData,
    availabilityData,
    meetingsData,
    usersData
  ] = await Promise.all([
    db.select().from(tasks).all(),
    db.select().from(milestones).all(),
    db.select().from(userAvailability).all(),
    db.select().from(meetings).all(),
    db.select().from(users).all()
  ]);

  const usersById = new Map(usersData.map(u => [u.id, u]));

  // Transform data for the calendar
  const events = [
    ...tasksData.filter(t => t.dueAt).map(t => ({
      id: `task-${t.id}`,
      title: `Task: ${t.title}`,
      start: t.dueAt,
      end: t.dueAt,
      allDay: true,
      type: 'task',
      status: t.status,
      assignee: t.assignedToUserId ? usersById.get(t.assignedToUserId)?.name : 'Unassigned'
    })),
    ...milestonesData.filter(m => m.dueAt).map(m => ({
      id: `milestone-${m.id}`,
      title: `Milestone: ${m.title}`,
      start: m.dueAt,
      end: m.dueAt,
      allDay: true,
      type: 'milestone',
      status: m.status
    })),
    ...availabilityData.map(a => ({
      id: `avail-${a.id}`,
      title: `${usersById.get(a.userId)?.name || 'User'} - ${a.type}`,
      start: a.startDate,
      end: a.endDate,
      allDay: true,
      type: 'availability',
      status: a.status,
      userId: a.userId
    })),
    ...meetingsData.map(m => ({
      id: `meeting-${m.id}`,
      title: m.title,
      start: m.startAt,
      end: m.endAt || new Date(m.startAt.getTime() + 60 * 60 * 1000), // Default 1h
      allDay: false,
      type: 'meeting',
      status: m.status
    }))
  ];

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">Manage schedule, tasks, and team availability.</p>
      </div>
      
      <CalendarClient events={events} users={usersData} />
    </main>
  );
}
