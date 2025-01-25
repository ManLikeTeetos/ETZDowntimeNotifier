import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import data from "../components/data.json";
import Down from "../images/down.png";
import UP from "../images/up.png";

const Row = ({ id, logo, name, type, downtime, reason, resolution }) => {
    const formatTimeDifference = (downtime) => {
       // if (!downtime || downtime === "00:00") return "0";
      
        // Split the downtime into hours and minutes
        const timeParts = downtime.split(":").map(Number);
        if (timeParts.length < 2 || timeParts.length > 3) {
          console.error(`Invalid downtime format: ${downtime}`);
          return "Invalid format";
        }
      
        const [hours, minutes, seconds = 0] = timeParts;
      
        // Create a date object for the current time
        const currentTime = new Date();
      
        // Create a date object for the downtime (on the same day as current time)
        const downTimeDate = new Date(currentTime);
        downTimeDate.setHours(hours, minutes, seconds, 0);
      
        // If downtime is in the future (e.g., past midnight), assume it started the previous day
        if (downTimeDate > currentTime) {
          downTimeDate.setDate(downTimeDate.getDate() - 1);
        }
      
        // Calculate the time difference in milliseconds
        const timeDifferenceMilliseconds = currentTime - downTimeDate;
      
        // Convert milliseconds to hours and minutes
        const totalMinutes = Math.floor(timeDifferenceMilliseconds / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
      
        // Format the result in human-readable terms
        if (totalHours > 0) {
          return remainingMinutes > 0
            ? `${totalHours}hrs ${remainingMinutes}minutes`
            : `${totalHours}hrs`;
        } else {
          return `${totalMinutes}minutes`;
        }
      };
      
      
      
      

  return (
    <tr key={id}>
      <td className="image-cell">
        <img
          src={logo}
          alt={name}
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      </td>
      <td>{name}</td>
      <td>{type}</td>
      <td>{downtime === "00:00" ? "N/A" : downtime}</td>
      <td>{formatTimeDifference(downtime)}</td>
      <td>{reason}</td>
      <td>{resolution}</td>
    </tr>
  );
};

function Dashboard() {
  const [banks, setBanks] = useState([]);
  const [downBanksData, setDownBanksData] = useState([]);
  const [upBanksData, setUpBanksData] = useState([]);

  useEffect(() => {
    const savedBanks = JSON.parse(localStorage.getItem("banks"));
    const savedDownBanks = JSON.parse(localStorage.getItem("downbanks")) || [];
    const savedUpBanks = JSON.parse(localStorage.getItem("upbanks")) || [];

    if (!savedBanks) {
      // Initialize localStorage with data from `data.json` if `banks` key doesn't exist
      localStorage.setItem("banks", JSON.stringify(data.banks));
      localStorage.setItem("upbanks", JSON.stringify(data.banks)); // Initially all banks are "up"
      setBanks(data.banks);
      setUpBanksData(data.banks);
    } else {
      // Load existing data from localStorage
      setBanks(savedBanks);
      setDownBanksData(savedDownBanks);
      setUpBanksData(savedUpBanks);
    }
  }, []); // Run only on component mount

  return (
    <div>
      <Navbar />
      <div className="Dashboard">
        {/* DOWN BANKS */}
        <div className="downbanks">
          <h1>DOWN BANKS</h1>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Bank Name</th>
                <th>Type</th>
                <th>Down Since</th>
                <th>Down Time</th>
                <th>Reason</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {downBanksData.length > 0 ? (
                downBanksData.map((row) => (
                  <Row
                    key={row.id}
                    logo={Down}
                    name={row.bankname}
                    type={row.type}
                    downtime={row.downtime}
                    reason={row.reason}
                    resolution={row.status}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7">No bank is currently down</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* UP BANKS */}
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
                <th>Reason</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {upBanksData.length > 0 ? (
                upBanksData.map((row) => (
                  <Row
                    key={row.id}
                    logo={UP}
                    name={row.bankname}
                    type={row.type}
                    downtime={row.downtime}
                    reason={row.reason}
                    resolution={row.status}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7">No bank is currently up</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
