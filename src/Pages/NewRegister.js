import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigate for redirecting
import Navbar from "../components/Navbar";
import "../styling/NewRegister.css"

function UserRegistration() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    department: "",
    isAdmin: false
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const checkAdmin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.admin) { // Check if user is not found or not an admin
        navigate("/dashboard"); // Redirect to dashboard if not admin
      } else {
        fetchUsers(); // Fetch users if the current user is an admin
      }
    };
    
    checkAdmin(); // Call the function to check admin status
  }, [navigate]);

  const fetchUsers = async () => {
    const adminUsername = localStorage.getItem("username"); // Get the admin username from local storage
    if (!adminUsername) {
      console.error("Admin username not found in local storage.");
      return;
    }
    try {
      const response = await axios.get(`https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/auth/users?adminUsername=${adminUsername}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, isAdmin: !formData.isAdmin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/auth/register", formData);
      if (response.data.message === "Registration Successful") {
        setMessage("User registered successfully!");
        fetchUsers(); // Refresh users list
      } else {
        setMessage("User already exists!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Failed to register user.");
    }
  };

  return (
    <div>
      <Navbar />  
      <div className="RegBody">
        <h2>User Registration</h2>

        <div className="RegForm"> 
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
            />
            <div>
              <label>
                Admin User
                <input
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
            <button type="submit">Register User</button>
          </form>
        </div>

        {message && <p>{message}</p>}

        <hr />

        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.department}</td>
                <td>{user.admin ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserRegistration;
