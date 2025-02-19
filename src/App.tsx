import React, { useState } from "react";

// Define the Address interface with proper types
interface Address {
  street: string;
  city: string;
  postalCode: string | number;
}

const App: React.FC = () => {
  // Initialize the addresses state with an array of Address objects
  const [addresses, setAddresses] = useState<Address[]>([
    { street: "", city: "", postalCode: "" },
  ]);
  const [startTime, setStartTime] = useState<string>(""); // For manual start time

  // Update function to modify a specific field in a given address
  const updateAddress = (index: number, field: keyof Address, value: string | number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index], // Keep the other fields intact
      [field]: value,          // Update the specific field
    };
    setAddresses(newAddresses); // Update the state with the modified addresses
  };

  // Function to handle schedule generation
  const generateSchedule = () => {
    console.log("Schedule generated with start time:", startTime);
    // Additional logic for generating the schedule can be added here
  };

  // Function to reset fields
  const resetFields = () => {
    setAddresses([{ street: "", city: "", postalCode: "" }]);
    setStartTime(""); // Reset start time
  };

  return (
    <div>
      {/* Input for manual start time */}
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)} // Update the startTime state
        placeholder="Start Time"
      />
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
      {/* Buttons for generate schedule and reset */}
      <button onClick={generateSchedule}>Generate Schedule</button>
      <button onClick={resetFields}>Reset All</button>
    </div>
  );
};

export default App;

