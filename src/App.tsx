import React, { useState } from "react";

// Define the Schedule interface
interface Schedule {
  address: string; // Combine street, city, and postal code into a single address field
  showingDuration: number;
  startTime: string;
  endTime: string;
}

const App: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>([""]); // Array to hold addresses as strings
  const [startTime, setStartTime] = useState<string>("13:00"); // Default start time (1:00 PM)
  const [schedule, setSchedule] = useState<Schedule[]>([]); // Use Schedule type for schedule

  // Function to add a new address input
  const addAddress = () => {
    setAddresses([...addresses, ""]); // Add a new empty string for the address
  };

  // Function to update a specific address in the array
  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value; // Update the specific address
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
    return nextTime;
  };

  // Function to generate schedule based on addresses and start time
  const generateSchedule = () => {
    const newSchedule: Schedule[] = [];
    const showingDuration = 15; // Fixed showing duration for simplicity
    const travelTimes = [15, 30]; // Example travel times for demonstration
    const startTimeParts = startTime.split(":");
    const initialDate = new Date();
    initialDate.setHours(Number(startTimeParts[0]), Number(startTimeParts[1]), 0, 0);
    let currentTime = initialDate;

    addresses.forEach((address, index) => {
      const travelTime = travelTimes[index % travelTimes.length]; // Cycle through travel times
      const endTime = calculateNextBookingTime(currentTime, travelTime, showingDuration);
      newSchedule.push({
        address: address,
        showingDuration: showingDuration,
        startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      });
      currentTime = new Date(endTime.getTime() + travelTime * 60000);
      currentTime = roundToQuarterHour(currentTime); // Round to the nearest quarter hour after scheduling
    });

    setSchedule(newSchedule);
  };

  // Function to reset all fields
  const resetFields = () => {
    setAddresses([""]); // Reset to a single empty address field
    setStartTime("13:00");
    setSchedule([]);
  };

  return (
    <div>
      <h1>SHBA Scheduler 🏡</h1>
      <label>
        Start Time:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
      {addresses.map((address, index) => (
        <div key={index}>
          <input
            type="text"
            value={address}
            onChange={(e) => updateAddress(index, e.target.value)}
            placeholder="Enter Address (Street, City, Postal Code)"
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
            <th>Showing Time</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((showing, index) => (
            <tr key={index}>
              <td>{showing.address}</td>
              <td>{showing.showingDuration} min</td>
              <td>{showing.startTime}</td>
              <td>{showing.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
