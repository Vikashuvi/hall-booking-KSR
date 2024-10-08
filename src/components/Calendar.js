import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, subDays, getDay } from 'date-fns';
import BookingModal from './BookingModal';
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const availableHalls = ['Hall A', 'Hall B', 'Hall C'];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const fetchedBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBookings(fetchedBookings);
  };

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

  const isTimeSlotAvailable = (date, startTime, endTime, hall) => {
    return !bookings.some(booking =>
      isSameDay(new Date(booking.date), date) &&
      booking.selectedHall === hall &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
      (endTime > booking.startTime && endTime <= booking.endTime) ||
      (startTime <= booking.startTime && endTime >= booking.endTime))
    );
  };

  const handleBookingSubmit = async (bookingData) => {
    const { date, startTime, endTime, selectedHall } = bookingData;

    if (!isTimeSlotAvailable(new Date(date), startTime, endTime, selectedHall)) {
      setWarningMessage(`The selected time slot for ${selectedHall} is already booked.`);
      setShowWarning(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("Document written with ID: ", docRef.id);
      setBookings([...bookings, { ...bookingData, id: docRef.id }]);
      setIsModalOpen(false);
      setShowConfirmation(true);
      fetchBookings(); // Refresh bookings after adding a new one
    } catch (e) {
      console.error("Error adding document: ", e);
      setWarningMessage("An error occurred while booking. Please try again.");
      setShowWarning(true);
    }
  };

  const getBookedSlots = () => {
    const bookedSlots = {};
    bookings.forEach(booking => {
      if (!bookedSlots[booking.selectedHall]) {
        bookedSlots[booking.selectedHall] = [];
      }
      bookedSlots[booking.selectedHall].push({
        start: booking.startTime,
        end: booking.endTime,
        date: booking.date
      });
    });
    return bookedSlots;
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = subDays(monthStart, getDay(monthStart));
    const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    for (let i = 0; i < dateRange.length; i += 7) {
      weeks.push(dateRange.slice(i, i + 7));
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold p-2">{day}</div>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map(date => (
              <button
                key={date.toString()}
                className={`h-24 p-2 border rounded-lg flex flex-col items-start justify-start transition-colors ${
                  isSameMonth(date, currentDate)
                    ? isSameDay(date, new Date())
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-gray-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
                onClick={() => {
                  setCurrentDate(date);
                  setView('day');
                }}
              >
                <span className="text-sm font-semibold">{format(date, 'd')}</span>
                {bookings.some(booking => isSameDay(new Date(booking.date), date)) && (
                  <span className="text-xs bg-green-200 rounded px-1 mt-1">Booked</span>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 8 }, (_, i) => i + 9);
    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const time = format(new Date(2021, 0, 1, hour), 'h:mm a');

          const isFullyBooked = availableHalls.every(hall => 
            bookings.some(booking => 
              isSameDay(new Date(booking.date), currentDate) && 
              booking.selectedHall === hall &&
              booking.startTime <= time &&
              booking.endTime > time
            )
          );

          return (
            <div key={hour} className="border rounded-lg p-2 flex justify-between items-center">
              <span>{format(new Date(2021, 0, 1, hour), 'h:mm a')}</span>
              <button 
                className={`px-4 py-2 rounded-lg ${
                  isFullyBooked ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => handleBookingRequest(time)}
                disabled={isFullyBooked}
              >
                {isFullyBooked ? 'Fully Booked' : 'Book'}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <button onClick={goToPreviousPeriod} className="px-4 py-2 bg-gray-200 rounded-lg mr-2">Back</button>
              <button onClick={goToToday} className="px-4 py-2 bg-gray-200 rounded-lg mr-2">Today</button>
              <button onClick={goToNextPeriod} className="px-4 py-2 bg-gray-200 rounded-lg">Next</button>
            </div>
            <h2 className="text-2xl font-bold">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy')
                : format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <div>
              <button 
                onClick={() => setView('month')} 
                className={`px-4 py-2 rounded-lg mr-2 ${
                  view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => setView('day')} 
                className={`px-4 py-2 rounded-lg ${
                  view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {view === 'month' ? renderMonthView() : renderDayView()}
        </div>
      </div>
      {selectedSlot && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBook={handleBookingSubmit}
          date={format(selectedSlot.date, 'yyyy-MM-dd')}
          availableHalls={availableHalls}
          bookedSlots={getBookedSlots()}
        />
      )}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Booking Confirmed</h2>
            <p>Your event has been successfully booked.</p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Booking Failed</h2>
            <p>{warningMessage}</p>
            <button
              onClick={() => setShowWarning(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;