import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkAddDonor } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./AddDonorModal.css";
import { useSelector } from "react-redux";

function AddDonorModal({ onAdd }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("One-time");
  const [errors, setErrors] = useState({});
  const sessionUser = useSelector((state) => state.session.user);
  const handleSave = async () => {
    const newDonor = {
      user_id:sessionUser.id,
      donor_name: donorName,
      amount: parseFloat(amount),
      frequency,
    };

    // Basic validation
    const validationErrors = {};
    if (!donorName.trim()) validationErrors.donor_name = "Donor name is required.";
    if (!amount || amount <= 0) validationErrors.amount = "Amount must be greater than 0.";


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const response = dispatch(thunkAddDonor(newDonor));
    if (response?.errors) {
      setErrors(response.errors); // Handle server-side errors
    } else {
      onAdd(response); // Notify parent to upde the donors list
      closeModal();
    }
  };

  return (
    <div className="add-donor-modal">
      <h2>Add New Donor</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Donor Name:
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />
          {errors.donor_name && <p className="error">{errors.donor_name}</p>}
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {errors.amount && <p className="error">{errors.amount}</p>}
        </label>
        <label>
          Frequency:
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>
        <div className="add-donor-modal-buttons">
          <button type="button" onClick={closeModal}>Cancel</button>
          <button type="button" onClick={handleSave}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default AddDonorModal;
