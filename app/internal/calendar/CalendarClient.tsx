
'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addAvailability } from './actions';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: string;
  status?: string;
  userId?: string;
  assignee?: string;
}

interface CalendarClientProps {
  events: CalendarEvent[];
  users: any[];
}

export default function CalendarClient({ events, users }: CalendarClientProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Event Style Getter
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    if (event.type === 'task') backgroundColor = '#3b82f6'; // Blue
    if (event.type === 'milestone') backgroundColor = '#8b5cf6'; // Purple
    if (event.type === 'meeting') backgroundColor = '#10b981'; // Green
    if (event.type === 'availability') backgroundColor = '#f59e0b'; // Orange (Vacation)

    if (event.status === 'done' || event.status === 'completed') backgroundColor = '#9ca3af'; // Gray

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Vacation / Leave
          </button>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Task</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Milestone</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Meeting</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Availability</div>
        </div>
      </div>

      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>

      {/* Add Availability Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Log Time Off</h2>
            <form action={async (formData) => {
              await addAvailability(formData);
              setShowModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select name="type" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="vacation">Vacation</option>
                    <option value="sick_leave">Sick Leave</option>
                    <option value="public_holiday">Public Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input type="date" name="startDate" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input type="date" name="endDate" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <textarea name="reason" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={3}></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
