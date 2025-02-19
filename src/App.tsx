import React, { useState } from "react";

// Define the Address interface with the correct types
interface Address {
  street: string;
  city: string;
  postalCode: string | number;
  duration: number;
  travelTime: number;
}

const App: React.FC = () => {
  // Initialize the addresses state with an array of Address objects
  const [addresses, setAddresses] = useState<Address[]>([
    { street: "", city: "", postalCode: "", duration: 15, travelTime: 0 },
  ]);

  // Function to add a new address row
  const addAddress = () => {
    setAddresses([...addresses, { street: "", city: "", postalCode: "", duration: 15, travelTime: 0 }]);
  };

  // Update function to modify a specific field in a given address
  const updateAddress = (index: number, field: keyof Address, value: string | number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index], // Keep the other fields intact
      [field]: value,         // Update the specific field
    };
    setAddresses(newAddresses); // Update the state with the modified addresses
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
            value={address.duration}
            onChange={(e) => updateAddress(index, "duration", Number(e.target.value))}
            placeholder="Duration"
          />
          <input
            type="number"
            value={address.travelTime}
            onChange={(e) => updateAddress(index, "travelTime", Number(e.target.value))}
            placeholder="Travel Time"
          />
        </div>
      ))}
      <button onClick={addAddress}>Add Address</button>
    </div>
  );
};

export default App;
