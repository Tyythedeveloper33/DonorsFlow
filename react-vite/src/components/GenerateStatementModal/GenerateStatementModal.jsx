import { useModal } from "../../context/Modal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkAddStatment, thunkLoadDonorData } from "../../redux/session";
import { useParams } from "react-router-dom"; // Import useParams to get the id from URL params

export function GenerateStatementModal({ onGenerate }) {
  const { closeModal } = useModal();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  // Get the donor id from URL params
  const { id } = useParams(); // Assuming your route is something like `/donor/:id`

  const handleGenerate = async () => {
    const validationErrors = {};
    if (!startDate) validationErrors.startDate = "Start date is required.";
    if (!endDate) validationErrors.endDate = "End date is required.";
    if (new Date(startDate) > new Date(endDate)) {
      validationErrors.dateRange = "Start date cannot be after the end date.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await dispatch(thunkAddStatment(startDate, endDate, id));

      if (result.errors) {
        setErrors(result.errors);
      } else {
        // After successfully adding the statement, reload the donor data using the id from the params
        dispatch(thunkLoadDonorData(id)); // Pass `id` to load the updated donor data

        onGenerate({ startDate, endDate }); // Callback to handle any additional functionality
        closeModal(); // Close the modal after generation
      }
    } catch (error) {
      console.error("Error generating statement:", error);
    }
  };

  return (
    <div className="generate-statement-modal">
      <h2>Generate Statement</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        {errors.startDate && <p className="error">{errors.startDate}</p>}

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        {errors.endDate && <p className="error">{errors.endDate}</p>}
        {errors.dateRange && <p className="error">{errors.dateRange}</p>}

        <div className="generate-statement-modal-buttons">
          <button type="button" onClick={closeModal}>Cancel</button>
          <button type="button" onClick={handleGenerate}>Generate</button>
        </div>
      </form>
    </div>
  );
}
