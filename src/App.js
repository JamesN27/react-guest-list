import './App.css';
import React, { useState } from 'react';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const addGuest = (newFirstName, newLastName) => {
    const newGuest = {
      firstName: newFirstName,
      lastName: newLastName,
      attending: false,
    };
    setGuests([...guests, newGuest]);
  };
  const clearFields = () => {
    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <label htmlFor="firstName">Last name:</label>
      <input
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />
      <label htmlFor="lastName">Last name:</label>
      <input
        id="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addGuest(firstName, lastName);
            clearFields();
          }
        }}
      />

      {guests.map((guest) => (
        <div key={`guest--${guest.id}`} data-test-id="guest">
          <p>First Name: {guest.firstName}</p>
          <p>Last Name: {guest.lastName}</p>
          <p>Attending: {guest.attending ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}
