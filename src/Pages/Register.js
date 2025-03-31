import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Register.css";
import LoginImg from "../images/signin.jpg";
import { Email, Lock } from "@mui/icons-material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Password mismatch error
  const [error, setError] = useState(""); // General error
  const [success, setSuccess] = useState(""); // Success message

  const navigate = useNavigate();

  // Handle confirm password input and check if it matches the password
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && value !== password) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if passwords don't match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setPasswordError(""); // Clear error if passwords match
    setError(""); // Clear general errors

    const requestBody = { email, password };

    try {
      const response = await fetch(
        "http://172.17.10.95/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (response.ok && data.message === "Registration Successful") {
        setSuccess("Registration Successful!");
      } else if(response.ok && data.message === "User Already Exist") {
        setSuccess("User Exist, Please Login");
      } else {
        setError(data.message || "An error occured. Please try again later");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="Login">
      <div className="container">
        <div className="signin-image">
          <figure>
            <img src={LoginImg} alt="Sign in" />
          </figure>
        </div>

        <div className="signin-form">
          <h2 className="form-title">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group-login">
              <Email className="icon" />
              <input
                type="text"
                name="email"
                value={email}
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group-login">
              <Lock className="icon" />
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group-login">
              <Lock className="icon" />
              <input
                type="password"
                name="confirm_password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={handleConfirmPasswordChange}
              />
            </div>

            {/* Show real-time password match error */}
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && (
              <div>
                <p style={{ color: "green" }}>{success}</p>
                <div 
                  style={{ 
                    color: "blue", 
                    cursor: "pointer", 
                    textDecoration: "underline", 
                    marginBottom: "20px",
                  }} 
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </div>
              </div>
            )}
            <button type="submit" className="form-submit" disabled={passwordError}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
