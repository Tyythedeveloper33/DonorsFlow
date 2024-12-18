import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { thunkLogin, thunkSignup } from "../../redux/session";
import "./LognSign.css";

export default function LognSignPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To redirect the user after login/signup

  const [formType, setFormType] = useState("signup");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const sessionUser = useSelector((state) => state.session.user);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (sessionUser) {
      navigate("/home"); // Change "/dashboard" to your desired route
    }
  }, [sessionUser, navigate]);

  const toggleFormType = () => {
    setFormType(formType === "signup" ? "login" : "signup");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = { email, password };
    if (formType === "signup") formData.username = username;

    let serverResponse;
    if (formType === "signup") {
      serverResponse = await dispatch(thunkSignup(formData));
    } else {
      serverResponse = await dispatch(thunkLogin(formData));
    }

    if (serverResponse?.errors) {
      setErrors(serverResponse.errors);
    }
  }

  // Render nothing if sessionUser exists
  if (sessionUser) return null;

  return (
    <div className="form-container">
      <h1 className="DonorsFlow">DonorsFlow</h1>
      <h3 className="Empowering">Empowering Impact Through Giving</h3>

      <form className="auth-form" onSubmit={handleSubmit}>
        {formType === "signup" && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {formType === "signup" ? "Sign Up" : "Log In"}
        </button>

        <div className="switch-form">
          {formType === "signup" ? (
            <p>
              Already have an account?{" "}
              <a onClick={toggleFormType} href="#">
                Log in
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <a onClick={toggleFormType} href="#">
                Sign up
              </a>
            </p>
          )}
        </div>

        {errors && (
          <div className="error-messages">
            {Object.values(errors).map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
