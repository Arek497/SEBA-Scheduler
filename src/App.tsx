import React, { useState } from "react";

// Define the Address interface with proper types
interface Address {
  street: string;
  city: string;
  postalCode: string | number;
  travelTime: number; // Time taken to travel to the next address
  showingDuration: number; // Duration of the showing
}

// Define the Schedule interface
interface Schedule {
  street: string;
  city: string;
  startTime: string;
  showingDuration: number;
  travelTime: number;
  nextBookingTime: string;
}

const App: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    { street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 10 },
  ]);
  const [startTime, setStartTime] = useState<string>("08:00"); // Default start time
  const [schedule, setSchedule] = useState<Schedule[]>([]); // Use Schedule type for schedule

  // Function to add a new address
  const addAddress = () => {
    setAddresses([...addresses, { street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 10 }]);
  };

  // Update function to modify a specific field in a given address
  const updateAddress = (index: number, field: keyof Address, value: string | number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    };
    setAddresses(newAddresses);
  };

  // Function to round time to the nearest quarter hour
  const roundToQuarterHour = (date: Date): Date => {
    const minutes = date.getMinutes();
    const remainder = minutes % 15;
    date.setMinutes(minutes + (15 - remainder));
    return date;
  };

  // Function to calculate the next booking time based on travel and showing duration
  const calculateNextBookingTime = (currentTime: Date, travelTime: number, showingDuration: number) => {
    let nextTime = new Date(currentTime.getTime() + (travelTime + showingDuration) * 60000);
    nextTime = roundToQuarterHour(nextTime); // Round to nearest quarter hour
    return nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to generate schedule based on addresses and start time
  const generateSchedule = () => {
    const newSchedule: Schedule[] = [];
    const startTimeParts = startTime.split(":");
    const initialDate = new Date();
    initialDate.setHours(Number(startTimeParts[0]), Number(startTimeParts[1]), 0, 0);
    let currentTime = initialDate;

    addresses.forEach((address) => {
      const nextBookingTime = calculateNextBookingTime(currentTime, address.travelTime, address.showingDuration);
      newSchedule.push({
        street: address.street,
        city: address.city,
        startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showingDuration: address.showingDuration,
        travelTime: address.travelTime,
        nextBookingTime: nextBookingTime,
      });
      currentTime = new Date(currentTime.getTime() + (address.travelTime + address.showingDuration) * 60000);
      currentTime = roundToQuarterHour(currentTime); // Round to the nearest quarter hour after scheduling
    });

    setSchedule(newSchedule);
  };

  // Function to reset all fields
  const resetFields = () => {
    setAddresses([{ street: "", city: "", postalCode: "", travelTime: 0, showingDuration: 10 }]);
    setStartTime("08:00");
    setSchedule([]);
  };

  return (
    <div>
      <h1>Schedule Management</h1>
      <label>
        Start Time:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
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
      <button onClick={addAddress}>Add Address</button>
      <button onClick={generateSchedule}>Generate Schedule</button>
      <button onClick={resetFields}>Reset Fields</button>
      <h2>Generated Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Showing</th>
            <th>Address</th>
            <th>Start Time</th>
            <th>Duration (min)</th>
            <th>Travel Time (min)</th>
            <th>Next Booking Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((showing, index) => (
            <tr key={index}>
              <td>Showing {index + 1}</td>
              <td>{showing.street}, {showing.city}</td>
              <td>{showing.startTime}</td>
              <td>{showing.showingDuration}</td>
              <td>{showing.travelTime}</td>
              <td>{showing.nextBookingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
