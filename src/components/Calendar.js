// src/components/Calendar.js
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, subDays } from 'date-fns';
import BookingModal from './BookingModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);

  const goToToday = () => setCurrentDate(new Date());
  const goToNextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };
  const goToPreviousPeriod = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleBookingRequest = (time) => {
    setSelectedSlot({ date: currentDate, time });
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (bookingData) => {
    setBookings([...bookings, bookingData]);
    // Here you would typically send this data to a backend API
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold p-2">{day}</div>
        ))}
        {dateRange.map(date => (
          <button
            key={date.toString()}
            className={`h-14 ${
              isSameDay(date, new Date()) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            } ${!isSameMonth(date, currentDate) ? 'text-gray-400' : ''}`}
            onClick={() => {
              setCurrentDate(date);
              setView('day');
            }}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM

    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const time = `${hour}:00`;
          const isBooked = bookings.some(booking => 
            isSameDay(new Date(booking.date), currentDate) && booking.time === time
          );

          return (
            <div key={hour} className="border p-2 flex justify-between items-center">
              <span>{time}</span>
              <button 
                className={`px-4 py-2 rounded ${
                  isBooked ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => handleBookingRequest(time)}
                disabled={isBooked}
              >
                {isBooked ? 'Booked' : 'Book'}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={goToPreviousPeriod} className="px-4 py-2 bg-gray-200 rounded mr-2">Back</button>
          <button onClick={goToToday} className="px-4 py-2 bg-gray-200 rounded mr-2">Today</button>
          <button onClick={goToNextPeriod} className="px-4 py-2 bg-gray-200 rounded">Next</button>
        </div>
        <h2 className="text-2xl font-bold">
          {view === 'month' 
            ? format(currentDate, 'MMMM yyyy')
            : format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        <div>
          <button 
            onClick={() => setView('month')} 
            className={`px-4 py-2 rounded mr-2 ${
              view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setView('day')} 
            className={`px-4 py-2 rounded ${
              view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Day
          </button>
        </div>
      </div>
      {view === 'month' ? renderMonthView() : renderDayView()}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBookingSubmit}
        date={selectedSlot ? format(selectedSlot.date, 'MMMM d, yyyy') : ''}
        time={selectedSlot ? selectedSlot.time : ''}
      />
    </div>
  );
};

export default Calendar;