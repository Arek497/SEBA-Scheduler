import React, { useState } from "react";

// Define the Address interface with proper types
interface Address {
  street: string;
  city: string;
  postalCode: string | number;
  travelTime: number; // in minutes
  showingDuration: number; // in minutes
}

const App: React.FC = () => {
  // Initialize the addresses state with an array of Address objects
  const [addresses, setAddresses] = useState<Address[]>([
    { street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 0 },
  ]);
  const [startTime, setStartTime] = useState<string>("");
  const [schedule, setSchedule] = useState<string[]>([]);

  // Update function to modify a specific field in a given address
  const updateAddress = (index: number, field: keyof Address, value: string | number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index], // Keep the other fields intact
      [field]: value,          // Update the specific field
    };
    setAddresses(newAddresses); // Update the state with the modified addresses
  };

  // Function to add a new address
  const addAddress = () => {
    setAddresses([...addresses, { street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 0 }]);
  };

  // Function to calculate the next booking time
  const calculateNextBookingTime = (currentTime: Date, travelTime: number, showingDuration: number) => {
    const totalTime = travelTime + showingDuration;
    const nextTime = new Date(currentTime.getTime() + totalTime * 60000); // Convert minutes to milliseconds

    // Round to the nearest quarter-hour
    const minutes = nextTime.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    nextTime.setMinutes(roundedMinutes);
    if (roundedMinutes === 60) {
      nextTime.setHours(nextTime.getHours() + 1);
      nextTime.setMinutes(0);
    }
    
    return nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to generate schedule based on addresses and start time
  const generateSchedule = () => {
    const newSchedule: string[] = [];
    let currentTime = new Date(`1970-01-01T${startTime}:00`); // Using a fixed date

    addresses.forEach((address, index) => {
      const nextBookingTime = calculateNextBookingTime(currentTime, address.travelTime, address.showingDuration);
      newSchedule.push(`Showing ${index + 1}: ${address.street}, ${address.city} at ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Duration: ${address.showingDuration} min, Travel Time: ${address.travelTime} min. Next Booking Time: ${nextBookingTime}`);
      currentTime = new Date(`1970-01-01T${nextBookingTime}:00`); // Update current time to next booking time
    });
    
    setSchedule(newSchedule);
  };

  // Function to reset all fields
  const resetFields = () => {
    setAddresses([{ street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 0 }]);
    setStartTime("");
    setSchedule([]);
  };

  return (
    <div>
      {/* Render the list of addresses */}
      {addresses.map((address, index) => (
        <div key={index}>
          <input
            type="text"
            value={address.street}
            onChange={(e) => updateAddress(index, "street", e.target.value)}
            placeholder="Street"
          />
          <input
            type="text"
            value={address.city}
            onChange={(e) => updateAddress(index, "city", e.target.value)}
            placeholder="City"
          />
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => updateAddress(index, "postalCode", e.target.value)}
            placeholder="Postal Code"
          />
          <input
            type="number"
            value={address.travelTime}
            onChange={(e) => updateAddress(index, "travelTime", Number(e.target.value))}
            placeholder="Travel Time (min)"
          />
          <input
            type="number"
            value={address.showingDuration}
            onChange={(e) => updateAddress(index, "showingDuration", Number(e.target.value))}
            placeholder="Showing Duration (min)"
          />
        </div>
      ))}

      {/* Button to add another address */}
      <button onClick={addAddress}>Add Another Address</button>

      {/* Manual start time input */}
      <div>
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* Button to generate schedule */}
      <button onClick={generateSchedule}>Generate Schedule</button>

      {/* Button to reset all fields */}
      <button onClick={resetFields}>Reset All</button>

      {/* Display the generated schedule */}
      <div>
        <h2>Schedule:</h2>
        <ul>
          {schedule.map((showing, index) => (
            <li key={index}>{showing}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
