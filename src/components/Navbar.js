import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import '../styling/Navbar.css';


function Navbar() {
  const navigate = useNavigate();

    useEffect(() => {
      // Redirect to login if no email is found in localStorage
      if (!localStorage.getItem("email")) {
        navigate("/");
      }
    }, [navigate]);
    

  const Signout = () => {
    localStorage.clear(); // Clear everything from localStorage
    navigate("/login");
  };

  // Get the email from localStorage and extract the username (before the @ symbol)
  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : null;

  return (
    <div className="Navbar">
      <div>
        <h1>Downtime Notifier</h1>
      </div>
      <div className="Menu">
        <Link to="/dashboard"><h1>Dashboard</h1></Link>
        <Link to="/report"><h1>Report</h1></Link>
        <Link to="/update"><h1>Update</h1></Link>
        <Link to="/admin"><h1>Admin</h1></Link>
        <h1 onClick={Signout}>Sign out</h1>
        {username && <h1>Welcome, {username}</h1>} {/* Show username if logged in */}
      </div>
    </div>
  );
}

export default Navbar;
