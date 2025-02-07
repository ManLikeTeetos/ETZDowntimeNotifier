import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import Down from "../images/down.png";
import UP from "../images/up.png";

const Row = ({ id, bankname, type, downtime, uptime, status, reason, resolution, dateCreated, onDelete }) => {
    const formatTimeDifference = (downtime, uptime, createdAt) => {
      const parseTime = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return isNaN(hours) || isNaN(minutes) ? null : { hours, minutes };
      };
  
      const downtimeParsed = parseTime(downtime);
      const uptimeParsed = parseTime(uptime);
  
      if (!downtimeParsed) return "Invalid format";
      
      if (uptimeParsed && uptime !== "00:00") {
        // If uptime is valid and not 00:00, calculate uptime - downtime
        const downtimeDate = new Date();
        const uptimeDate = new Date();
  
        downtimeDate.setHours(downtimeParsed.hours, downtimeParsed.minutes, 0, 0);
        uptimeDate.setHours(uptimeParsed.hours, uptimeParsed.minutes, 0, 0);
  
        // If uptime is before downtime, assume it occurred on the next day
        if (uptimeDate < downtimeDate) {
          uptimeDate.setDate(uptimeDate.getDate() + 1);
        }
  
        const diffMilliseconds = uptimeDate - downtimeDate;
        const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
        return diffHours > 0 ? `${diffHours}hrs ${diffMinutes}min` : `${diffMinutes}min`;
      } else {
        // Revert to default logic if uptime is 00:00
        const now = new Date();
        const createdDate = new Date(createdAt);
  
        createdDate.setHours(downtimeParsed.hours, downtimeParsed.minutes, 0, 0);
  
        if (createdDate > now) {
          createdDate.setDate(createdDate.getDate() - 1);
        }
  
        const dateDiffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        const diffMilliseconds = now - createdDate;
        const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
        const totalHours = diffHours + dateDiffDays * 24;
        return totalHours > 0 ? `${totalHours}hrs ${diffMinutes}min` : `${diffMinutes}min`;
      }
    };
  
    return (
      <tr key={id}>
        <td>{bankname}</td>
        <td>{type || 'FT'}</td>
        <td>{downtime}</td>
        <td>{uptime}</td>
        <td>{formatTimeDifference(downtime, uptime, dateCreated)}</td>
        <td>{reason}</td>
        <td>{new Date(dateCreated).toISOString().split("T")[0]}</td>
        {onDelete && (
          <td>
            <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
          </td>
        )}
      </tr>
    );
  };
  


function Report() {
  const [downBanksData, setDownBanksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 20;

  const fetchBankStatusByDate = async () => {
    setLoading(true);
    try {
      const bankStatusResponse = await fetch(
        `https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/api/bank-status/by-date?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
      );
     
      if (!bankStatusResponse.ok) {
        throw new Error("Some API requests failed");
      }
  
      const bankStatusData = await bankStatusResponse.json();
  
  
      // Step 1: Get the latest status for each bank
      const latestBankStatus = bankStatusData.reduce((acc, bank) => {
        if (!acc[bank.bankname] || new Date(bank.dateCreated) > new Date(acc[bank.bankname].dateCreated)) {
          acc[bank.bankname] = bank;  // Store the latest record
        }
        return acc;
      }, {});
  
    //   const downBanks = [];
    
  
    //   banksData.forEach((bank) => {
    //     const statusData = latestBankStatus[bank.bankname];
  
    //     if (statusData) {
    //       const { downtime, uptime, status, reason, resolution } = statusData;
  
    //       if (downtime !== "00:00" && uptime === "00:00") {
    //         downBanks.push({ ...statusData, logo: Down });
    //       } else {
    //         upBanks.push({ ...statusData, logo: UP });
    //       }
    //     } else {
    //       upBanks.push({
    //         bankname: bank.bankname,
    //         logo: UP,
    //         downtime: "00:00",
    //         uptime: "00:00",
    //         status: "Up",
    //         reason: "None",
    //         resolution: "Node up",
    //       });
    //     }
    //   });
  
      setDownBanksData(bankStatusData);
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
    if (direction === "next" && (currentPage + 1) * itemsPerPage < downBanksData.length) {
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
                <th>Bank Name</th>
                <th>Type</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Reason</th>
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
              {Math.ceil(downBanksData.length / itemsPerPage)}
            </span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange("next")}
              disabled={(currentPage + 1) * itemsPerPage >= downBanksData.length}
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
}

export default Report;
