import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Newlogin.css";
import Logo from "../images/etranzactlogo.png";
import { Email, Lock } from "@mui/icons-material";




const NewLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store any error messages
  const [success, setSuccess] = useState(""); // To store success messages

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
      //navigate("/");
      //request body
      const requestBody = {
        username,
        password,
      };

     // try {
        //Post request to Login
        const response = await fetch("https://bookish-capybara-xpqv7wr6q5gf6977-8080.app.github.dev/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (response.ok && data.message === "Login Successful") {
          // Registration was successful, navigate to the dashboard
          setSuccess("Login Successful")

          // Store full user details in localStorage
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("username", username); // Save username to localStorage
          navigate("/dashboard");
        } else {
          // Handle failure (invalid input, user already exists, etc.)

          setError(data.message || "Invalid Credentials");
        }
     // }catch(error) {
         // Catch any network or server errors
      //setError("An error occurred. Please try again later.");
     // }
  }
  return (
    <div className="Login">
        <div className="Logo">
            <img src={Logo} alt="Logo" />
        </div>
        <div className="container-login">
            <h2 className="form-title">Log Your Incidence</h2>
            <div className="signin-form">

                {/* <div className="center-align">
                <span>"You have been logged out successfully"</span>
                </div> */}
                <form className="register-form" id="login-form" onSubmit={handleSubmit}>
                <div className="form-input">
                   <label>Email Address</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        placeholder="Your Username"
                        className="form-input"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                <div className="form-input">
                   <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        className="form-input"
                        onChange={(e) =>setPassword(e.target.value)}
                    />
                </div>
                {/* <div className="remember-section">
                    <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                    <label htmlFor="remember-me" className="label-agree-term label-login">
                    <span></span>Remember me on this computer
                    </label>
                </div> */}
                {success && <p style={{ color: "green" }}>{success}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="form-button">
                    <button type="submit" name="signin" id="signin" className="form-submit"> Sign-In </button>
                </div>
                </form>
            </div>
        </div>
    </div>

  );
};

export default NewLogin;
