import './App.css';
import React, { useEffect, useState } from 'react';

export default function App() {
  const baseUrl =
    'http://fee50489-60ea-4a37-b552-fa345e536535.id.repl.co/guests/';
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchGuestsFromAPI = () => {
      fetch(`${baseUrl}/guests`)
        .then((response) => response.json())
        .then((data) => setGuests(data))
        .catch((error) => console.log(error));
    };

    fetchGuestsFromAPI();
  }, []);

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
  const deleteGuest = (guestId) => {
    const updatedGuests = guests.filter((guest) => guest.id !== guestId);
    setGuests(updatedGuests);
  };
  const toggleAttending = (guestId) => {
    const updatedGuests = guests.map((guest) => {
      if (guest.id === guestId) {
        return { ...guest, attending: !guest.attending };
      }
      return guest;
    });
    setGuests(updatedGuests);
  };

  return (
    <div>
      <label htmlFor="firstName">First name:</label>
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
          <label
            htmlFor={`attending-${guest.id}`}
            aria-label={`${guest.firstName} ${guest.lastName} attending status`}
          >
            Attending:
            <input
              id={`attending-${guest.id}`}
              type="checkbox"
              checked={guest.attending}
              onChange={() => toggleAttending(guest.id)}
            />
          </label>
          <button
            onClick={() => deleteGuest(guest.id)}
            aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
