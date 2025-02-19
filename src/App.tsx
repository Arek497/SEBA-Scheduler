import React, { useState } from "react";

// Define the Address interface with proper types
interface Address {
  street: string;
  city: string;
  postalCode: string;
}

const App: React.FC = () => {
  // Initialize the addresses state with an array of Address objects
  const [addresses, setAddresses] = useState<Address[]>([
    { street: "", city: "", postalCode: "" },
  ]);
  const [startTime, setStartTime] = useState<string>("09:00 AM");
  const [showingDuration, setShowingDuration] = useState<number>(10);
  const [travelTime, setTravelTime] = useState<number>(5);
  const [schedule, setSchedule] = useState<any[]>([]);

  // Function to update a specific field in a given address
  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    };
    setAddresses(newAddresses);
  };

  // Function to add a new address
  const addAddress = () => {
    setAddresses([...addresses, { street: "", city: "", postalCode: "" }]);
  };

  // Function to reset all fields
  const resetFields = () => {
    setAddresses([{ street: "", city: "", postalCode: "" }]);
    setStartTime("09:00 AM");
    setShowingDuration(10);
    setTravelTime(5);
    setSchedule([]);
  };

  // Function to generate the schedule
  const generateSchedule = () => {
    const newSchedule = [];
    let currentTime = new Date(`1970-01-01T${startTime}`);

    addresses.forEach((address) => {
      const showingDurationInMs = showingDuration * 60 * 1000; // Convert minutes to milliseconds
      const travelTimeInMs = travelTime * 60 * 1000; // Convert minutes to milliseconds

      const showingStartTime = new Date(currentTime); // Showing start time
      const showingEndTime = new Date(currentTime.getTime() + showingDurationInMs); // Calculate showing end time

      // Format the start and end times
      const startFormatted = formatTime(showingStartTime);
      const endFormatted = formatTime(showingEndTime);

      newSchedule.push({
        street: address.street,
        showingDuration: `${showingDuration} min`,
        travelTime: `${travelTime} min`,
        start: startFormatted,
        end: endFormatted,
      });

      // Update current time for the next showing
      currentTime = new Date(showingEndTime.getTime() + travelTimeInMs); // Next showing starts after travel time
      // Round the next start time to the nearest quarter-hour
      currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 15) * 15);
    });

    setSchedule(newSchedule); // Update state with the new schedule
  };

  // Helper function to format time as "hh:mm AM/PM"
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div>
      <h1>SHBA Scheduler 🏡</h1>
      <div>
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div>
        <label>Showing Duration (min):</label>
        <input
          type="number"
          value={showingDuration}
          onChange={(e) => setShowingDuration(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Travel Time (min):</label>
        <input
          type="number"
          value={travelTime}
          onChange={(e) => setTravelTime(Number(e.target.value))}
        />
      </div>

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
        </div>
      ))}

      <button onClick={addAddress}>Add Address ➕</button>
      <button onClick={generateSchedule}>Generate Schedule 🚀</button>
      <button onClick={resetFields}>Reset All 🔄</button>

      <h2>Generated Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Showing Duration</th>
            <th>Travel Time</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td>{entry.street}</td>
              <td>{entry.showingDuration}</td>
              <td>{entry.travelTime}</td>
              <td>{entry.start}</td>
              <td>{entry.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
