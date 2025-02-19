import React, { useState } from "react";

// Define the Schedule interface
interface Schedule {
  address: string; // Combined address field
  showingDuration: number;
  travelTime: number;
  startTime: string;
  endTime: string;
}

const App: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>([""]); // Array to hold addresses as strings
  const [startTime, setStartTime] = useState<string>("09:00"); // Default start time (9:00 AM)
  const [schedule, setSchedule] = useState<Schedule[]>([]); // Schedule state

  // State to hold showing duration and travel time
  const [showingDurations, setShowingDurations] = useState<number[]>([10]); // Default duration
  const [travelTimes, setTravelTimes] = useState<number[]>([5]); // Default travel time

  // Function to add a new address input
  const addAddress = () => {
    setAddresses([...addresses, ""]); // Add a new empty string for the address
    setShowingDurations([...showingDurations, 10]); // Default showing duration for new address
    setTravelTimes([...travelTimes, 5]); // Default travel time for new address
  };

  // Function to update a specific address in the array
  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value; // Update the specific address
    setAddresses(newAddresses);
  };

  // Function to update showing duration
  const updateShowingDuration = (index: number, value: number) => {
    const newShowingDurations = [...showingDurations];
    newShowingDurations[index] = value; // Update the specific duration
    setShowingDurations(newShowingDurations);
  };

  // Function to update travel time
  const updateTravelTime = (index: number, value: number) => {
    const newTravelTimes = [...travelTimes];
    newTravelTimes[index] = value; // Update the specific travel time
    setTravelTimes(newTravelTimes);
  };

  // Function to round time to the nearest quarter hour
  const roundToQuarterHour = (date: Date): Date => {
    const minutes = date.getMinutes();
    const remainder = minutes % 15;
    date.setMinutes(minutes + (remainder ? 15 - remainder : 0)); // Round up to the next quarter hour
    return date;
  };

  // Function to calculate the next booking time based on travel and showing duration
  const calculateNextBookingTime = (currentTime: Date, travelTime: number, showingDuration: number) => {
    const endTime = new Date(currentTime.getTime() + (travelTime + showingDuration) * 60000);
    return roundToQuarterHour(endTime); // Round to the nearest quarter hour
  };

  // Function to generate schedule based on addresses, start time, showing duration, and travel time
  const generateSchedule = () => {
    const newSchedule: Schedule[] = [];
    const startTimeParts = startTime.split(":");
    const initialDate = new Date();
    initialDate.setHours(Number(startTimeParts[0]), Number(startTimeParts[1]), 0, 0);
    let currentTime = initialDate;

    addresses.forEach((address, index) => {
      const showingDuration = showingDurations[index]; // Get showing duration from array
      const travelTime = travelTimes[index]; // Get travel time from array
      const endTime = calculateNextBookingTime(currentTime, travelTime, showingDuration);

      newSchedule.push({
        address: address,
        showingDuration: showingDuration,
        travelTime: travelTime,
        startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      });

      // Update currentTime for the next showing
      currentTime = endTime; // Set current time to end of the last showing
    });

    setSchedule(newSchedule);
  };

  // Function to reset all fields
  const resetFields = () => {
    setAddresses([""]); // Reset to a single empty address field
    setShowingDurations([10]);
    setTravelTimes([5]);
    setStartTime("09:00");
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
          <label>
            Showing Duration (min):
            <input
              type="number"
              value={showingDurations[index]}
              onChange={(e) => updateShowingDuration(index, Number(e.target.value))}
              min={1}
            />
          </label>
          <label>
            Travel Time (min):
            <input
              type="number"
              value={travelTimes[index]}
              onChange={(e) => updateTravelTime(index, Number(e.target.value))}
              min={1}
            />
          </label>
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
          {schedule.map((showing, index) => (
            <tr key={index}>
              <td>{showing.address}</td>
              <td>{showing.showingDuration} min</td>
              <td>{showing.travelTime} min</td>
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
