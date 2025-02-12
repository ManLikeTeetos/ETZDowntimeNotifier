import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import '../styling/Navbar.css';


function Navbar() {
  const navigate = useNavigate();

    useEffect(() => {
      // Redirect to login if no email is found in localStorage
      if (!localStorage.getItem("username")) {
        navigate("/");
      }
    }, [navigate]);
    

  const Signout = () => {
    localStorage.clear(); // Clear everything from localStorage
    navigate("/login");
  };

  // Get the email from localStorage and extract the username (before the @ symbol)
  const username = localStorage.getItem("username");
 

  return (
    <div className="Navbar">
      <div>
        <h1>Downtime Notifier</h1>
      </div>
      <div className="Menu">
        <Link to="/dashboard" target="_blank" rel="noopener noreferrer"><h1>Dashboard</h1></Link>
        <Link to="/report" target="_blank" rel="noopener noreferrer"><h1>Report</h1></Link>
        <Link to="/update" target="_blank" rel="noopener noreferrer"><h1>Update</h1></Link>
        <Link to="/admin" target="_blank" rel="noopener noreferrer"><h1>Admin</h1></Link>
        <h1 onClick={Signout}>Sign out</h1>
        {username && <h1>Welcome, {username}</h1>} {/* Show username if logged in */}
      </div>
    </div>
  );
}

export default Navbar;
