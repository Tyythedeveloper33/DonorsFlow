import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './UpdateSubscription.css';
import { useNavigate } from 'react-router-dom';
const UpdateSubscription = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const { id } = useParams();
  const navigate = useNavigate()
  // Handle updating the subscription
  const handleUpdateSubscription = async () => {
    if (!amount || !type) {
      alert('Both amount and type are required');
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, type }),
      });

      if (response.ok) {
        const updatedSubscription = await response.json();
        alert('Subscription updated successfully');
        // You can redirect or update the UI based on the updated subscription data
        // Example: Redirect to the subscriptions list or details page
        navigate('/'); // Example redirect
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('An error occurred while updating the subscription');
    }
  };

  // Handle deleting the subscription
  const handleDeleteSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);  // Show success message
        // Redirect to subscriptions list or homepage after deleting
        navigate('/')
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('An error occurred while deleting the subscription');
    }
  };

  return (
    <div className="update-subscription-container">
      <h2>Update Subscription</h2>

      <div className="input-group">
        <label>Amount:</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Subscription Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="button-group">
        <button className="update-button" onClick={handleUpdateSubscription}>
          Update Subscription
        </button>
        <button className="delete-button" onClick={handleDeleteSubscription}>
          Delete Subscription
        </button>
      </div>
    </div>
  );
};

export default UpdateSubscription;
