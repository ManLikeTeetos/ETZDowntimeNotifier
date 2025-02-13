import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Update.css";
import axios from "axios";



function Update() {
  const [selectedBank, setSelectedBank] = useState("");
  const [type, setType] = useState("FT");
  const [selectedError, setSelectedError] = useState("");
  const [time, setTime] = useState({ hours: "00", minutes: "00" });
  const [resolution, setResolution] = useState("NIP");
  const [reason, setReason] = useState("None");
  const [banksData, setBanksData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [reasonData, setReasonData] = useState([]);



  const username = localStorage.getItem("username"); 

  useEffect(() => {

    
    const fetchData = async () => {
      const banksResponse = await fetch(
        "https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/banks",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const statusResponse = await fetch(
        "https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/status",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const reasonResponse = await fetch(
        "https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/reasons",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (
        !banksResponse.ok ||
        !statusResponse.ok ||
        !reasonResponse.ok
      ) {
        throw new Error("Some API requests failed");
      }

      const banksData = await banksResponse.json();
      const statusData = await statusResponse.json();
      const reasonData = await reasonResponse.json();

      setBanksData(banksData);
      setStatusData(statusData);
      setReasonData(reasonData);
    };

    fetchData();
  }, []);

  // Validate time function
  const validateTime = () => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    const selectedHours = parseInt(time.hours, 10);
    const selectedMinutes = parseInt(time.minutes, 10);

    if (selectedHours > currentHours || (selectedHours === currentHours && selectedMinutes > currentMinutes)) {
      return false; // Time is greater than the current time
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTime()) {
      alert("The selected time cannot be in the future.");
      return; // Prevent form submission if time is invalid
    }

    const timeString = `${time.hours}:${time.minutes}`;
    let requestBody;

    if (selectedError === "Successful") {
      // Success case (sending uptime)
      requestBody = {
        bankname: selectedBank,
        type: type,
        uptime: timeString,
        status: "Successful",
        reason: reason,
        resolution: resolution,
        username : username
      };
    } else {
      // Error case (sending downtime)
      requestBody = {
        bankname: selectedBank,
        downtime: timeString,
        type: type,
        status: selectedError, // Assuming error status here
        reason: reason,
        resolution: resolution,
        username : username
      };
    }

    try {
      const response = await axios.post(
        "https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/bank-status/add",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Bank status updated successfully!");
      // Reset form
      setSelectedBank("");
      setType("FT");
      setSelectedError("");
      setTime({ hours: "00", minutes: "00" });
      setResolution("NIP");
      setReason("None");
    } catch (error) {
      console.error("Error updating bank status:", error);
      alert("Failed to update bank status.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="Update">
        <div className="form-container">
          <form className="form-inner" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Bank Name</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="">Select Bank</option>
                {banksData.map((bank) => (
                  <option key={bank.id} value={bank.bankname}>
                    {bank.bankname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="FT">FT</option>
                <option value="VT">VT</option>
                <option value="EITS">EITS</option>
                <option value="Inward">Inward</option>
              </select>
            </div>

            <div className="form-group">
              <label>Error</label>
              <select
                value={selectedError}
                onChange={(e) => setSelectedError(e.target.value)}
              >
                <option value="">Select Error</option>
                {statusData.map((status) => (
                  <option key={status.code} value={status.message}>
                    {status.message}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time</label>
              <div className="time-inputs">
                <select
                  value={time.hours}
                  onChange={(e) => setTime({ ...time, hours: e.target.value })}
                >
                  {[...Array(24).keys()].map((h) => (
                    <option key={h} value={String(h).padStart(2, "0")}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                :
                <select
                  value={time.minutes}
                  onChange={(e) => setTime({ ...time, minutes: e.target.value })}
                >
                  {[...Array(60).keys()].map((m) => (
                    <option key={m} value={String(m).padStart(2, "0")}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              >
                <option value="NIP">NIP</option>
                <option value="Node down">Node down</option>
                <option value="Node up">Node up</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="None">Select Reason</option>
                {reasonData.map((item, index) => (
                  <option key={index} value={item.message}>
                    {item.message}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Update;
