import './App.css';
import React, { useEffect, useState } from 'react';

const baseUrl = 'https://fee50489-60ea-4a37-b552-fa345e536535.id.repl.co';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const loadGuests = () => {
    fetch(`${baseUrl}/guests`)
      .then((response) => response.json())
      .then((data) => {
        setGuests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading guests:', error);
      });
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const addGuest = () => {
    if (firstName && lastName) {
      const newGuest = {
        firstName,
        lastName,
        attending: false,
      };
      fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuest),
      })
        .then((response) => response.json())
        .then((data) => {
          setGuests([...guests, data]);
          setFirstName('');
          setLastName('');
        })
        .catch((error) => {
          console.error('Error adding guest:', error);
        });
    }
  };

  const removeGuest = async (guestId) => {
    try {
      await fetch(`${baseUrl}/guests/${guestId}`, {
        method: 'DELETE',
      });
      setGuests(guests.filter((guest) => guest.id !== guestId));
    } catch (error) {
      console.error('Error removing guest:', error);
    }
  };

  const toggleAttending = async (guestId) => {
    try {
      const updatedGuests = guests.map((guest) => {
        if (guest.id === guestId) {
          return {
            ...guest,
            attending: !guest.attending,
          };
        }
        return guest;
      });
      await fetch(`${baseUrl}/guests/${guestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuests),
      });
      setGuests(updatedGuests);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div className="CentralGuestListModule">
      <h1>🥂💃 Your Party Guestlist 🥳🥂</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="label-input-container">
            <label htmlFor="firstName" className="firstname">
              First Name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="label-input-container">
            <label htmlFor="lastName" className="lastname">
              Last Name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addGuest();
                }
              }}
            />
          </div>
          <button onClick={addGuest} className="MainButton">
            Add Guest
          </button>

          <div>
            {guests.map((guest) => (
              <div key={`guest-${guest.id}`} data-test-id={`guest-${guest.id}`}>
                <div className="guest-name-container">
                  <p className="guest-name">
                    {guest.firstName} {guest.lastName}
                  </p>
                </div>
                <div className="guest-actions">
                  <button
                    onClick={() => removeGuest(guest.id)}
                    aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  >
                    Remove
                  </button>
                  <label>
                    <input
                      type="checkbox"
                      checked={guest.attending}
                      onChange={() => toggleAttending(guest.id)}
                      aria-label={`${guest.firstName} ${guest.lastName} ${
                        guest.attending ? 'attending' : 'not attending'
                      } status`}
                    />
                    <span
                      className={`attending-status ${
                        guest.attending ? 'attending' : 'not-attending'
                      }`}
                    >
                      {guest.attending ? 'Attending' : 'Not attending'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
