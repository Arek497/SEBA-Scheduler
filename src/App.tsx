import React, { useState } from "react";
import "./App.css";

// Define a type for the schedule entry
interface ScheduleEntry {
  street: string;
  showingDuration: string;
  travelTime: string;
  start: string;
  end: string;
}

const App: React.FC = () => {
  const [startTime, setStartTime] = useState("09:00 AM");
  const [addresses, setAddresses] = useState<{ street: string }[]>([
    { street: "564 Stonecliffe Rd, Oakville, ON L6L 4N9" },
    { street: "1322 Stanbury Rd, Oakville, ON L6L 2J4" },
    { street: "348 Winston Rd, Oakville, ON L6L 4W5" },
    { street: "231 Wedgewood Dr, Oakville, ON L6J 4R6" },
  ]);
  const [showingDuration, setShowingDuration] = useState<number>(10);
  const [travelTime, setTravelTime] = useState<number>(5);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  const formatTime = (date: Date): string => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() < 12 ? "AM" : "PM";
    return `${hours}:${minutes} ${ampm}`;
  };

  const generateSchedule = () => {
    const newSchedule: ScheduleEntry[] = [];
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

  const resetAll = () => {
    setStartTime("09:00 AM");
    setAddresses([{ street: "" }]);
    setShowingDuration(10);
    setTravelTime(5);
    setSchedule([]);
  };

  return (
    <div className="App">
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
      <div>
        <label>Address:</label>
        <input
          type="text"
          onChange={(e) => setAddresses([{ street: e.target.value }])}
        />
      </div>
      <button onClick={generateSchedule}>Generate Schedule 🚀</button>
      <button onClick={resetAll}>Reset All 🔄</button>
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
