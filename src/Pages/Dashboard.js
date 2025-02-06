import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import Down from "../images/down.png";
import UP from "../images/up.png";

const Row = ({ id, logo, bankname, type, downtime, uptime, status, reason, resolution, onDelete }) => {
  const formatTimeDifference = (downtime) => {
    const [hours, minutes] = downtime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return "Invalid format";
    }

    const now = new Date();
    const downtimeDate = new Date(now);
    downtimeDate.setHours(hours, minutes, 0, 0);

    if (downtimeDate > now) {
      downtimeDate.setDate(downtimeDate.getDate() - 1);
    }

    const diffMilliseconds = now - downtimeDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return diffHours > 0 ? `${diffHours}hrs ${diffMinutes}min` : `${diffMinutes}min`;
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
      <td>{downtime === "00:00" ? "N/A" : downtime}</td>
      <td>{formatTimeDifference(downtime)}</td>
      <td>{status}</td>
      <td>{reason}</td>
      <td>{resolution}</td>
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
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 7;

  const fetchBankStatusByDate = async () => {
    setLoading(true);
    try {
      const bankStatusResponse = await fetch(
        `https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/bank-status/by-date?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
      );
      const banksResponse = await fetch(
        "https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/banks"
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
            uptime: new Date().toISOString(),
            status: "Up",
            reason: "None",
            resolution: "Node up",
          });
        }
      });
  
      setDownBanksData(downBanks);
      setUpBanksData(upBanks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    fetchBankStatusByDate();
  }, [startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/bank-status/${id}`,
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
