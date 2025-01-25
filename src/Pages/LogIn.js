import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/LogIn.css";
import LoginImg from "../images/signin.jpg";
import { Email, Lock } from "@mui/icons-material";




const LogIn = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate("/"); // Navigate to the /dashboard route
    }
  return (
    <div className="Login">
        <div className="container">
      {/* Left Image Section */}
      <div className="signin-image">
        <figure>
          <img src={LoginImg} alt="Sign in" />
        </figure>
      </div>

      {/* Right Form Section */}
      <div className="signin-form">
        <h2 className="form-title">Welcome!</h2>
        <div className="center-align">
          <span>"You have been logged out successfully"</span>
        </div>
        <form className="register-form" id="login-form" onSubmit={handleSubmit}>
        <div className="form-group-login">
          <Email className="icon" />
          <input
            type="text"
            name="email"
            placeholder="Your Email"
            className="form-input"
          />
        </div>
        <div className="form-group-login">
          <Lock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
          />
        </div>
          <div className="remember-section">
            <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
            <label htmlFor="remember-me" className="label-agree-term label-login">
              <span></span>Remember me on this computer
            </label>
          </div>
          <div className="form-button">
            <input type="submit" name="signin" id="signin" className="form-submit" value="Log in" />
          </div>
        </form>
      </div>
        </div>
    </div>
    
  );
};

export default LogIn;
