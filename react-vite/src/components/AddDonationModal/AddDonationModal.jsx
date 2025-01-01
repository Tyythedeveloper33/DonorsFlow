import { useState } from "react";
import { useModal } from "../../context/Modal";
import "./AddDonationModal.css";
import { useParams } from "react-router-dom";

function AddDonationModal({ onAdd }) {
  const { closeModal } = useModal();
  const { id } = useParams();
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const newDonation = {
      donor_id: parseInt(id),
      amount: parseFloat(amount), // Ensure amount is a float
    };

    // Basic validation
    const validationErrors = {};
    if (amount <= 0) validationErrors.amount = "Donor amount must be greater than 0.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Call the onAdd function passed from the parent to handle the dispatch
    onAdd(newDonation);
    closeModal(); // Close the modal after saving
  };

  return (
    <div className="add-donor-modal">
      <h2>Add New Donation</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        {errors.amount && <p className="error">{errors.amount}</p>}
        <div className="add-donor-modal-buttons">
          <button type="button" onClick={closeModal}>Cancel</button>
          <button type="button" onClick={handleSave}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default AddDonationModal;
