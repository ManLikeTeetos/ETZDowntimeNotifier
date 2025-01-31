import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Admin = () => {
  const [banks, setBanks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [reasons, setReasons] = useState([]);

  const [newBank, setNewBank] = useState("");
  const [newStatusCode, setNewStatusCode] = useState("");
  const [newStatusMessage, setNewStatusMessage] = useState("");
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/data");
      const data = await response.json();
      setBanks(data.banks);
      setStatuses(data.status);
      setReasons(data.reason);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleAddBank = async () => {
    if (!newBank) return;
    const response = await fetch("http://localhost:8080/api/banks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankname: newBank }),
    });
    if (response.ok) {
      setNewBank("");
      fetchData();
    }
  };

  const handleAddStatus = async () => {
    if (!newStatusCode || !newStatusMessage) return;
    const response = await fetch("http://localhost:8080/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newStatusCode, message: newStatusMessage }),
    });
    if (response.ok) {
      setNewStatusCode("");
      setNewStatusMessage("");
      fetchData();
    }
  };

  const handleAddReason = async () => {
    if (!newReason) return;
    const response = await fetch("http://localhost:8080/api/reasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newReason }),
    });
    if (response.ok) {
      setNewReason("");
      fetchData();
    }
  };

  return (
    <div>
     <Navbar />
      <h2>Admin Panel</h2>

      {/* Add New Bank */}
      <div>
        <h3>Add Bank</h3>
        <input
          type="text"
          value={newBank}
          onChange={(e) => setNewBank(e.target.value)}
          placeholder="Bank Name"
        />
        <button onClick={handleAddBank}>Add Bank</button>
      </div>

      {/* Add New Status Code */}
      <div>
        <h3>Add Status Code</h3>
        <input
          type="text"
          value={newStatusCode}
          onChange={(e) => setNewStatusCode(e.target.value)}
          placeholder="Code"
        />
        <input
          type="text"
          value={newStatusMessage}
          onChange={(e) => setNewStatusMessage(e.target.value)}
          placeholder="Message"
        />
        <button onClick={handleAddStatus}>Add Status</button>
      </div>

      {/* Add New Reason */}
      <div>
        <h3>Add Reason</h3>
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          placeholder="Reason Message"
        />
        <button onClick={handleAddReason}>Add Reason</button>
      </div>

      {/* Display Data */}
      <h3>Banks</h3>
      <ul>{banks.map((bank) => <li key={bank.id}>{bank.bankname}</li>)}</ul>

      <h3>Status Codes</h3>
      <ul>{statuses.map((status) => <li key={status.code}>{status.code} - {status.message}</li>)}</ul>

      <h3>Reasons</h3>
      <ul>{reasons.map((reason, index) => <li key={index}>{reason.message}</li>)}</ul>
    </div>
  );
};

export default Admin;
