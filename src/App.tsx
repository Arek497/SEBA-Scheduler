import { useState } from "react";
import "./styles.css";

export default function App() {
  const [addresses, setAddresses] = useState([]);
  const [startTime, setStartTime] = useState("13:00");
  const [schedule, setSchedule] = useState([]);

  // Add a new address row
  const addAddress = () => {
    setAddresses([...addresses, { address: "", duration: 15, travelTime: 0 }]);
  };

  // Update an address row
  const updateAddress = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  // Reset everything
  const resetAll = () => {
    setAddresses([]);
    setSchedule([]);
    setStartTime("13:00");
  };

  // Calculate schedule
  const calculateSchedule = () => {
    let currentTime = new Date(`1970-01-01T${startTime}`);
    const newSchedule = [];

    addresses.forEach((address, index) => {
      // Round to nearest 15-minute slot
      const bookedStart = roundToNearestSlot(currentTime);
      const endTime = new Date(
        bookedStart.getTime() + address.duration * 60000
      );

      newSchedule.push({
        address: address.address,
        duration: address.duration,
        startTime: bookedStart.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      if (index < addresses.length - 1) {
        currentTime = new Date(endTime.getTime() + address.travelTime * 60000);
      }
    });

    setSchedule(newSchedule);
  };

  // Rounding logic
  const roundToNearestSlot = (time) => {
    const minutes = time.getMinutes();
    const remainder = minutes % 15;

    if (remainder > 5) {
      time.setMinutes(minutes + (15 - remainder));
    } else {
      time.setMinutes(minutes - remainder);
    }

    time.setSeconds(0);
    return time;
  };

  return (
    <div className="app">
      <h1>SHBA Scheduler 🏡</h1>

      {/* Start Time */}
      <div className="time-input">
        <label>Start Time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* Address Inputs */}
      {addresses.map((addr, index) => (
        <div key={index} className="address-row">
          <input
            placeholder="Address (e.g., 123 Main St)"
            value={addr.address}
            onChange={(e) => updateAddress(index, "address", e.target.value)}
          />
          <input
            type="number"
            placeholder="Showing Time (min)"
            value={addr.duration}
            onChange={(e) =>
              updateAddress(index, "duration", Number(e.target.value))
            }
          />
          <input
            type="number"
            placeholder="Travel Time to Next (min)"
            value={addr.travelTime}
            onChange={(e) =>
              updateAddress(index, "travelTime", Number(e.target.value))
            }
          />
        </div>
      ))}

      {/* Buttons */}
      <div className="button-group">
        <button onClick={addAddress}>Add Address ➕</button>
        <button onClick={calculateSchedule}>Generate Schedule 🚀</button>
        <button onClick={resetAll} className="reset-button">
          Reset All 🔄
        </button>
      </div>

      {/* Schedule Table */}
      {schedule.length > 0 && (
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
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.address}</td>
                <td>{item.duration} min</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
