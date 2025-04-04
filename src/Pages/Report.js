import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import * as XLSX from "xlsx";

const formatTimeDifference = (downtime, uptime, createdAt, allData, bankname) => {
  const parseTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    return isNaN(hours) || isNaN(minutes) ? null : { hours, minutes };
  };

  const downtimeParsed = parseTime(downtime);
  const uptimeParsed = parseTime(uptime);

  if (!downtimeParsed) return "Invalid format";

  const createdDate = new Date(createdAt);
  createdDate.setHours(downtimeParsed.hours, downtimeParsed.minutes, 0, 0);

  if (uptimeParsed && uptime !== "00:00") {
    const uptimeDate = new Date(createdDate);
    uptimeDate.setHours(uptimeParsed.hours, uptimeParsed.minutes, 0, 0);
    if (uptimeDate < createdDate) uptimeDate.setDate(uptimeDate.getDate() + 1);

    const diffMilliseconds = uptimeDate - createdDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return diffHours > 0 ? `${diffHours}hrs ${diffMinutes}min` : `${diffMinutes}min`;
  }

  // Find the next uptime entry for the same bank on a later date
  const nextUptimeEntry = allData.find(entry => 
    entry.bankname === bankname && 
    new Date(entry.dateCreated) > createdDate && 
    entry.uptime !== "00:00"
  );

  if (nextUptimeEntry) {
    const nextUptimeDate = new Date(nextUptimeEntry.dateCreated);
    nextUptimeDate.setHours(0, 0, 0, 0); // Set to the start of the day when uptime was recorded

    const diffMilliseconds = nextUptimeDate - createdDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return diffHours > 0 ? `${diffHours}hrs ${diffMinutes}min` : `${diffMinutes}min`;
  }

  // If no uptime, calculate difference between current time and downtime
  const now = new Date();
  if (createdDate > now) createdDate.setDate(createdDate.getDate() - 1);

  const diffMilliseconds = now - createdDate;
  const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  const remainingMilliseconds = diffMilliseconds % (1000 * 60 * 60 * 24); // Remaining time after full days
  const diffHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60)); // Remaining hours after days
  const diffMinutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes after hours
  
  return diffDays > 0 
    ? `${diffDays}d ${diffHours}hrs ${diffMinutes}min` 
    : diffHours > 0 
      ? `${diffHours}hrs ${diffMinutes}min` 
      : `${diffMinutes}min`;
};



const Row = ({ id, bankname, type, downtime, uptime, reason, username, dateCreated, allData, onDelete }) => (
  <tr>
    <td>{new Date(dateCreated).toISOString().split("T")[0]}</td>
    <td>{bankname}</td>
    <td>{type || 'FT'}</td>
    <td>{downtime !== "00:00" ? downtime : "WIP"}</td>
    <td>{uptime !== "00:00" ? uptime : "WIP"}</td>
    <td>{formatTimeDifference(downtime, uptime, dateCreated, allData, bankname)}</td>
    <td>{reason}</td>
    <td>{uptime !== "00:00" ? "Resolved" : "Pending"}</td>
    <td>{username} </td>
    {onDelete && (
      <td>
        <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
      </td>
    )}
  </tr>
);

function Report() {
  const [downBanksData, setDownBanksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentDate);
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState(currentDate);
  const [endTime, setEndTime] = useState("23:59");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;

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
      const response = await fetch(
        `http://172.17.10.95/api/bank-status/by-date?startDate=${startDate}T${startTime}:00&endDate=${endDate}T${endTime}:00`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setDownBanksData(data);
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      downBanksData.map(({ bankname, type, downtime, uptime, reason, dateCreated }) => ({
        "Date Created": new Date(dateCreated).toISOString().split("T")[0],
        "Bank Name": bankname,
        "Type": type || 'FT',
        "Start Time": downtime,
        "End Time": uptime !== "00:00" ? uptime : "",
        "Duration": formatTimeDifference(downtime, uptime, dateCreated, downBanksData, bankname),
        "Reason": reason,
        "Status":  uptime !== "00:00" ? "Resolved" : "Pending",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Report");
    XLSX.writeFile(workbook, `Bank_Report_${startDate}_to_${endDate}.xlsx`);
  };

  return (
    <div>
      <Navbar />
      <div className="Dashboard">
        <div className="date-picker">
          <label>Start Date:</label>
          <input className="date-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input className="date-input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <label>End Date:</label>
          <input className="date-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <input className="date-input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          <button className="date-input" onClick={fetchBankStatusByDate} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          <button className="date-input" onClick={exportToExcel}>Export to Excel</button>
        </div>
        <div className="downbanks">
          <h1>DOWN BANKS</h1>
          <table>
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Bank Name</th>
                <th>Type</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>ReportedBy</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {downBanksData.length > 0 ? (
                downBanksData.map((row) => <Row key={row.id} {...row} allData={downBanksData} onDelete={handleDelete} />)
              ) : (
                <tr><td colSpan="8">No bank is currently down</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
