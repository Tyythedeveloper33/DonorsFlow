import React, { useState } from "react";
import "./ManageSubscriptions.css";
import { createSubscription } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
export default function ManageSubscriptions() {
  const {id} = useParams()
  const dispatch = useDispatch();

  // State to hold form values
  const [formValues, setFormValues] = useState({
    donor_id:parseInt(id),
    amount: "",
    type: "weekly", // Updated from frequency to type
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch an action here or send data to backend
    console.log("Creating Subscription:", formValues);

    // Example dispatch:
    dispatch(createSubscription(formValues));
  };

  return (
    <div className="manage-subscriptions-container">
      <h1 className="manage-subscriptions-title">Manage Subscriptions</h1>
      <p className="manage-subscriptions-subtitle">
        Create and manage recurring donations for users
      </p>
      <form className="manage-subscriptions-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Subscription Amount</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            placeholder="$0.00"
            value={formValues.amount}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label> {/* Updated label */}
          <select
            id="type" // Updated from frequency to type
            className="form-control"
            value={formValues.type}
            onChange={handleChange}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Create Subscription
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setFormValues({ amount: "", type: "weekly" }) // Updated frequency to type
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
