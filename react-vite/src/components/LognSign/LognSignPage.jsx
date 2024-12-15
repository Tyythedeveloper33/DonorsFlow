import React, { useState } from "react";
import "./LognSign.css";

export default function LognSignPage() {
  const [formType, setFormType] = useState("signup"); // To switch between login and sign-up forms

  const toggleFormType = () => {
    setFormType(formType === "signup" ? "login" : "signup");
  };

  return (
    <div className="form-container">
      <h1 className="DonorsFlow">DonorsFlow</h1>
      <h3 className="Empowering">Empowering Impact Through Giving</h3>

      <form className="auth-form">
        {/* Username Input Field (for Sign Up) */}
        {formType === "signup" && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
        )}

        {/* Email Input Field */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Input Field */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          {formType === "signup" ? "Sign Up" : "Log In"}
        </button>

        {/* Switch between Sign-Up and Login */}
        <div className="switch-form">
          {formType === "signup" ? (
            <p>
              Already have an account? <a onClick={toggleFormType}>Log in</a>
            </p>
          ) : (
            <p>
              Don't have an account? <a onClick={toggleFormType}>Sign up</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
