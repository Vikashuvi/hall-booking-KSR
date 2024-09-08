import React, { useState, useEffect } from 'react';
import '../App.css'; // Make sure to create this CSS file

const BookingModal = ({ isOpen, onClose, onBook, date, availableHalls = [], bookedSlots = {} }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedHall, setSelectedHall] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventName, setEventName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form fields when modal opens
      setName('');
      setPhone('');
      setSelectedHall('');
      setStartTime('');
      setEndTime('');
      setEventName('');
      setDesignation('');
      setDepartment('');
    }
  }, [isOpen]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ name, phone, selectedHall, date, startTime, endTime, eventName, designation, department });
    onClose();
  };

  const isTimeSlotAvailable = (hall, start, end) => {
    const bookedSlotsForHall = bookedSlots[hall] || [];
    return !bookedSlotsForHall.some(slot => 
      (start >= slot.start && start < slot.end) || 
      (end > slot.start && end <= slot.end) ||
      (start <= slot.start && end >= slot.end)
    );
  };

  const renderTimeSlots = () => {
    const slots = [];
    const startHour = 9;  // 9 AM
    const endHour = 16;   // 4 PM
  
    for (let i = startHour; i <= endHour; i++) {
      const time24 = `${i.toString().padStart(2, '0')}:00`;
      const isAvailable = isTimeSlotAvailable(selectedHall, time24, `${(i+1).toString().padStart(2, '0')}:00`);
  
      const hour12 = i > 12 ? i - 12 : i;
      const period = i >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:00 ${period}`;
  
      slots.push(
        <option key={time24} value={time24} disabled={!isAvailable}>
          {time12} {!isAvailable && '(Booked)'}
        </option>
      );
    }
    return slots;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-hidden">
      <div className="bg-white rounded-lg w-full max-w-md m-4 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold p-6 pb-2">Book Hall</h2>
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          <form id="bookingForm" onSubmit={handleSubmit} className="p-6 pt-2">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-start">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 text-start">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full p-2 border rounded"
                pattern="[0-9]*"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hall" className="block mb-2 text-start">Select Hall</label>
              {availableHalls.length > 0 ? (
                <select
                  id="hall"
                  value={selectedHall}
                  onChange={(e) => setSelectedHall(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a hall</option>
                  {availableHalls.map(hall => (
                    <option key={hall} value={hall}>{hall}</option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500">No halls available at the moment.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Date</label>
              <input
                value={date}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4 flex space-x-2">
              <div className="flex-1">
                <label htmlFor="startTime" className="block mb-2 text-start">Start Time</label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                  disabled={!selectedHall}
                >
                  <option value="">Select start time</option>
                  {renderTimeSlots()}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="endTime" className="block mb-2 text-start">End Time</label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                  disabled={!selectedHall}
                >
                  <option value="">Select end time</option>
                  {renderTimeSlots()}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="eventName" className="block mb-2 text-start">Event Name</label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4 flex space-x-2">
              <div className="flex-1">
                <label htmlFor="designation" className="block mb-2 text-start">Designation</label>
                <input
                  id="designation"
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="department" className="block mb-2 text-start">Department</label>
                <input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="p-6 pt-2 border-t">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="bookingForm"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={availableHalls.length === 0}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;