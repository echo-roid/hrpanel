import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Video, Cake, CalendarHeart, Briefcase } from "lucide-react";
import AddEventModal from "./modals/AddEventModal";

const getMonthName = (month) =>
  new Date(2000, month).toLocaleString("default", { month: "long" });

const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
      <div className="flex justify-between">
        <div>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDay = startOfMonth.getDay() || 7;

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const buildCalendar = () => {
    const calendar = [];
    let dayCount = 1 - (startDay - 1);
    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const current = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          dayCount
        );
        days.push(current);
        dayCount++;
      }
      calendar.push(days);
    }
    return calendar;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const validateEvents = (data) => {
    if (!Array.isArray(data)) return [];
    return data.filter((event) => event.title && event.start_date);
  };

  const fetchCalendarEvents = async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    try {
      const response = await fetch(
        `http://localhost:5000/api/calendar?month=${month}&year=${year}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch calendar events");
      }

      const data = await response.json();
      setEvents(data.data);
      console.log(data.data)
      setError("");
    } catch (err) {
      console.error("Fetch calendar error:", err);
      setError(err.message);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const getEventsForDay = (day) => {
    const dayStr = formatDate(day);
    return events.filter((e) => {
      try {
        return formatDate(e.start_date) === dayStr;
      } catch (err) {
        console.error("Invalid event date:", e.start_date);
        return false;
      }
    });
  };

  const handleEventAdded = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const isEventExpired = (endDate) => {
    if (!endDate) return false;
    return new Date() > new Date(endDate);
  };

  async function deleteEventIfExpired(endDate, eventId) {
    if (!isEventExpired(endDate)) {
      console.log("Event is still active. No action taken.");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/calendar/delete/${eventId}`, {
        method: 'DELETE',
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }

      console.log('Expired event deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete Event Error:', error);
      return false;
    }
  }



  // Get today's date for comparison
  const isToday = (day) => day.toDateString() === new Date().toDateString();

  return (
    <div className="p-6 bg-[#f4f9fd] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[36px]">Calendar</h2>
        <button
          className="bg-[#3F8CFF] text-white rounded-lg px-4 py-2 flex items-center gap-1 shadow-md"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <h3 className="text-lg font-semibold">
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm text-gray-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {buildCalendar().map((week, i) => (
          <div key={i} className="grid grid-cols-7">
            {week.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isDayToday = isToday(day); // Check if it's today's date
              const dayEvents = getEventsForDay(day);

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] border p-1 relative ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                    } ${isDayToday ? "bg-blue-100 border-2 border-blue-500" : ""}`} // Apply the today marker
                >
                  <div
                    className={`text-xs text-right pr-1 ${isDayToday
                      ? "bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center ml-auto"
                      : ""
                      }`}
                  >
                    {day.getDate()}
                  </div>

                  {dayEvents.map((event) => {
                    // Check if it's a meeting and has an expired end_date

                    // if (event.event_type === "meeting" && isEventExpired(event.end_date)) {
                    //   deleteEventIfExpired(event.end_date, event.event_id);
                    // }


                    return (
                      <div
                        key={event.event_id || event.id}
                        className={`mt-1 rounded-lg px-2 py-1 shadow-sm text-xs ${event.event_type === "meeting"
                            ? "bg-blue-50 border-l-4 border-blue-400"
                            : event.event_type === "birthday"
                              ? "bg-pink-50 border-l-4 border-pink-400"
                              : "bg-gray-50 border-l-4 border-gray-400"
                          }`}
                      >
                        <div className="font-medium truncate flex items-center justify-between">
                          <div className="flex flex-col">
                            {event.title.length > 10 ? `${event.title.slice(0, 10)}...` : event.title}
                          </div>

                          {event.event_type === "meeting" ? (
                            <a
                              href={event.google_meet_link || event.manual_meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto"
                            >
                              <Video size={14} className="text-blue-500" />
                            </a>
                          ) : event.event_type === "birthday" ? (
                            <div>
                              <Cake size={14} className="text-pink-500" />
                            </div>
                          ) : (
                            <div>
                              <Briefcase size={14} className="text-gray-500" />
                            </div>
                          )}
                        </div>

                        {event.event_type === "meeting" && (
                          <div className="text-gray-500 text-[10px]">
                            {event.start_time} - {event.end_time}
                          </div>
                        )}

                        {event.event_type !== "meeting" && event.start_date && (
                          <div className="text-gray-500 text-[10px]">
                            {getTimeFromDate(event.start_date)}
                            {event.end_date && ` - ${getTimeFromDate(event.end_date)}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {open && (
        <AddEventModal
          onClose={() => setOpen(false)}
          onEventAdded={handleEventAdded}
          currentDate={currentDate}
        />
      )}

      <ErrorDisplay error={error} onRetry={fetchCalendarEvents} />
    </div>
  );
};

export default Calendar;
