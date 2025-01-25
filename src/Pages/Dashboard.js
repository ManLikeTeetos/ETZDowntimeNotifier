import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import data from "../components/data.json";
import Down from "../images/down.png";
import UP from "../images/up.png";

const Row = ({ id, logo, name, type, downtime, reason, resolution }) => {
  const formatTimeDifference = (downtime) => {
    const timeParts = downtime.split(":").map(Number);
    if (timeParts.length < 2 || timeParts.length > 3) {
      return "Invalid format";
    }

    const [hours, minutes, seconds = 0] = timeParts;

    const currentTime = new Date();
    const downTimeDate = new Date(currentTime);
    downTimeDate.setHours(hours, minutes, seconds, 0);

    if (downTimeDate > currentTime) {
      downTimeDate.setDate(downTimeDate.getDate() - 1);
    }

    const timeDifferenceMilliseconds = currentTime - downTimeDate;
    const totalMinutes = Math.floor(timeDifferenceMilliseconds / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; // Number of items per page for upbanks

  useEffect(() => {
    const savedBanks = JSON.parse(localStorage.getItem("banks"));
    const savedDownBanks = JSON.parse(localStorage.getItem("downbanks")) || [];
    const savedUpBanks = JSON.parse(localStorage.getItem("upbanks")) || [];

    if (!savedBanks) {
      localStorage.setItem("banks", JSON.stringify(data.banks));
      localStorage.setItem("upbanks", JSON.stringify(data.banks));
      setBanks(data.banks);
      setUpBanksData(data.banks);
    } else {
      setBanks(savedBanks);
      setDownBanksData(savedDownBanks);
      setUpBanksData(savedUpBanks);
    }
  }, []);

  const paginatedUpBanks = upBanksData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

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
              {paginatedUpBanks.length > 0 ? (
                paginatedUpBanks.map((row) => (
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

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of{" "}
              {Math.ceil(upBanksData.length / itemsPerPage)}
            </span>
            <button
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
