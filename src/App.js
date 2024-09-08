import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Calendar from './components/Calendar';
import BookedEventsPage from './components/BookedEventsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="bg-blue-500 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">KSR - Hall Booking System</h1>
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <Link to="/" className="hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/booked-events" className="hover:underline">Booked Events</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto mt-8">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/booked-events" element={<BookedEventsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
