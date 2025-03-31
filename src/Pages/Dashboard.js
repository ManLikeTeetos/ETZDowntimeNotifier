import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import Down from "../images/down.png";
import UP from "../images/up.png";

const Row = ({ id, logo, bankname, type, downtime, uptime, status, reason, username, resolution, dateCreated, onDelete }) => {
  const formatTimeDifference = (time, createdAt) => {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return "Invalid format";
    }

    const now = new Date();
    const createdDate = new Date(createdAt); // Convert dateCreated to a Date object

    // Set the provided downtime time on the createdDate
    createdDate.setHours(hours, minutes, 0, 0);

    if (createdDate > now) {
      createdDate.setDate(createdDate.getDate() - 1);
    }

   // Calculate difference in full days between createdDate and today
const dateDiffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

const diffMilliseconds = now - createdDate;
const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

// Calculate total hours including previous days
const totalHours = diffHours + dateDiffDays * 24;

// Remaining hours after full days are extracted
const remainingHours = totalHours % 24; 

// Construct the output string
return dateDiffDays > 0 
  ? `${dateDiffDays}d ${remainingHours}hrs ${diffMinutes}min`
  : totalHours > 0 
    ? `${totalHours}hrs ${diffMinutes}min` 
    : `${diffMinutes}min`;
  };

  // Format dateCreated to display as "YYYY-MM-DD HH:mm:ss"
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Formats based on user's locale
  };

  // Set type to 'FT' if not specified
  const displayType = type || 'FT';

  return (
    <tr key={id}>
      <td className="image-cell">
        <img src={logo} alt={bankname} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
      </td>
      <td>{bankname}</td>
      <td>{displayType}</td> {/* Use displayType here */}
      <td>{uptime && uptime !== "00:00" ? uptime : downtime === "00:00" ? "N/A" : downtime}</td>
      <td>{uptime !== "00:00" ? formatTimeDifference(uptime, dateCreated) : formatTimeDifference(downtime, dateCreated)}</td>
      <td>{uptime !== "00:00" ? "Successful" : status}</td>
      <td>{uptime !== "00:00" ? "None" : reason}</td>
      <td>{uptime !== "00:00" ? "Node Up" : resolution}</td>
      <td>{username} </td>

      <td>{status === "Up" ? "00:00" : formatDateTime(dateCreated)}</td> {/* Show "00:00" for Upbanks */}
      {/* Only keep delete button in Down Banks */}
      {onDelete && (
        <td>
          <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
        </td>
      )}
    </tr>
  );
};



function Dashboard() {
  const [downBanksData, setDownBanksData] = useState([]);
  const [upBanksData, setUpBanksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 7;

  

  const fetchBankStatusByDate = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be greater than end date.");
      setStartDate(endDate);
      return;
    }

    setLoading(true);
    try {
      const bankStatusResponse = await fetch(
        `http://172.17.10.95/api/bank-status/by-date?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
      );
      const banksResponse = await fetch(
        "http://172.17.10.95/api/banks"
      );
  
      if (!bankStatusResponse.ok || !banksResponse.ok) {
        throw new Error("Some API requests failed");
      }
  
      const bankStatusData = await bankStatusResponse.json();
      const banksData = await banksResponse.json();
  
      // Step 1: Get the latest status for each bank
      const latestBankStatus = bankStatusData.reduce((acc, bank) => {
        if (!acc[bank.bankname] || new Date(bank.dateCreated) > new Date(acc[bank.bankname].dateCreated)) {
          acc[bank.bankname] = bank;  // Store the latest record
        }
        return acc;
      }, {});
  
      const downBanks = [];
      const upBanks = [];
  
      banksData.forEach((bank) => {
        const statusData = latestBankStatus[bank.bankname];
  
        if (statusData) {
          const { downtime, uptime, status, reason, resolution } = statusData;
  
          if (downtime !== "00:00" && uptime === "00:00") {
            downBanks.push({ ...statusData, logo: Down });
          } else {
            upBanks.push({ ...statusData, logo: UP });
          }
        } else {
          upBanks.push({
            bankname: bank.bankname,
            logo: UP,
            downtime: "00:00",
            uptime: "00:00",
            status: "Up",
            reason: "None",
            resolution: "Node up",
            dateCreated: new Date().toISOString().split("T")[0] // Formats as "YYYY-MM-DD"
          });
        }
      });
  
      setDownBanksData(downBanks);
      // Sort upBanks to have the latest uptime entry at the top
      // Sort upBanks: Banks with uptime !== "00:00" first, then by latest uptime
      upBanks.sort((a, b) => {
        if (a.uptime !== "00:00" && b.uptime === "00:00") return -1; // a comes first
        if (a.uptime === "00:00" && b.uptime !== "00:00") return 1;  // b comes first

        // If both have non-zero uptime, sort by latest uptime
        const dateA = new Date(`${a.dateCreated}T${a.uptime}`);
        const dateB = new Date(`${b.dateCreated}T${b.uptime}`);
        return dateB - dateA; // Descending order (latest uptime first)
      });
      setUpBanksData(upBanks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchBankStatusByDate, refreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [refreshInterval]);
 

  useEffect(() => {
    fetchBankStatusByDate();
  }, [startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://172.17.10.95/api/bank-status/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Successfully deleted");
        setDownBanksData(downBanksData.filter((bank) => bank.id !== id));
      } else {
        console.error("Failed to delete bank status");
      }
    } catch (error) {
      console.error("Error deleting bank status:", error);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && (currentPage + 1) * itemsPerPage < upBanksData.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="Dashboard">
        <div className="date-picker">
          <label>Start Date:</label>
          <input className="date-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date:</label>
          <input  className="date-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <label>Auto Refresh:</label>
          <select className="date-input" value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))}>
            <option value="0">Off</option>
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
          </select>
          <button  className="date-input" onClick={fetchBankStatusByDate} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Down Banks */}
        <div className="downbanks">
          <h1>DOWN BANKS</h1>
          <p>{`Fetching data from ${startDate} to ${endDate}`}</p>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Bank Name</th>
                <th>Type</th>
                <th>Down Since</th>
                <th>Down Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Resolution</th>
                <th>ReportedBy</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {downBanksData.length > 0 ? (
                downBanksData.map((row) => (
                  <Row key={row.id} {...row} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td colSpan="9">No bank is currently down</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Up Banks */}
        <div className="upbanks">
          <h1>UP BANKS</h1>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Bank Name</th>
                <th>Type</th>
                <th>Up Since</th>
                <th>Up Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Resolution</th>
                <th>ReportedBy</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {upBanksData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((row) => (
                <Row key={row.id} {...row} />
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="pagination-btn">
              Page {currentPage + 1} of{" "}
              {Math.ceil(upBanksData.length / itemsPerPage)}
            </span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange("next")}
              disabled={(currentPage + 1) * itemsPerPage >= upBanksData.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
