import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, getDocs } from "firebase/firestore";



const BookedEventsPage = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookedEvents(events);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(undefined, options);
  };

  const fetchBookedEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookedEvents(events);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booked Events</h1>
      {bookedEvents.length === 0 ? (
        <p className="text-center text-gray-500">No events booked yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookedEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{event.eventName}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date:</span> {formatDate(event.date)}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Time:</span> {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Hall:</span> {event.selectedHall}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Booked by:</span> {event.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Phone:</span> {event.phone}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Designation:</span> {event.designation}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Department:</span> {event.department}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedEventsPage;