// src/App.js
import React from 'react';
import Calendar from './components/Calendar.js';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">KSR - Hall Booking System</h1>
      </header>
      <main className="container mx-auto mt-8">
        <Calendar />
      </main>
    </div>
  );
}

export default App;