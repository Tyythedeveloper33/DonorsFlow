import { useState } from "react";
import { useModal } from "../../context/Modal";
import "./EditDonorModal.css";
import { useDispatch } from "react-redux";
import { thunkUpdateDonation } from "../../redux/session";

function EditDonorModal({ donor, onSave }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [donorName, setDonorName] = useState(donor?.donor_name || "");
  const [amount, setAmount] = useState(donor?.amount || "");
  const [email, setemail] = useState(donor?.donor_email || "");
  const [phoneNumber, setPhoneNumber] = useState(donor?.donor_phone|| "");
  const [frequency, setFrequency] = useState(donor?.frequency || "One-time");
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const updatedDonor = {
      ...donor,
      donor_name: donorName,
      amount: parseFloat(amount),
      donor_phone:phoneNumber,
      donor_email:email, // Ensure the amount is stored as a number
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

    // Dispatch the update and call onSave
    const response = await dispatch(thunkUpdateDonation(updatedDonor));
    if (response?.errors) {
      setErrors(response.errors); // Handle server-side errors
    } else {
      onSave(updatedDonor); // Notify parent about the save
      closeModal();
    }
  };

  return (
    <div className="edit-donor-modal">
      <h2>Edit Donor</h2>
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
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

        </label>
        <label>
          phone:
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

        </label>
        <label>
          Frequency:
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>
        <div className="edit-donor-modal-buttons">
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDonorModal;
