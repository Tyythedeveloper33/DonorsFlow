import "./ViewDonors.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { thunkDeleteDonor, thunkLoadDonations } from "../../redux/session";
import { useModal } from "../../context/Modal";
import EditDonorModal from "../EditDonorModal/EditDonorModal";
import AddDonorModal from "../AddDonorModal/AddDonorModal";

export default function ViewDonors() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkLoadDonations(sessionUser.id));
    }
  }, [dispatch, sessionUser?.id]);

  useEffect(() => {
    if (sessionUser?.donations) {
      setDonors(sessionUser.donations);
    }
  }, [sessionUser?.donations]);

  const handleEdit = (donor) => {
    setModalContent(
      <EditDonorModal
        donor={donor}
        onSave={(updatedDonor) => {
          setDonors((prevDonors) =>
            prevDonors.map((d) => (d.id === updatedDonor.id ? updatedDonor : d))
          );
        }}
      />
    );
  };

  const handleDelete = (donor) => {
    dispatch(thunkDeleteDonor(sessionUser.id, donor));
  };

  const handleAdd = () => {
    setModalContent(
      <AddDonorModal
        onAdd={(newDonor) => {
          setDonors((prevDonors) => [...prevDonors, newDonor]);
          setTimeout(() => {
            dispatch(thunkLoadDonations(sessionUser.id));
          }, 100);
        }}
      />
    );
  };

  return (
    <div className="view-donors-container">
      <button className="add-donor-button" onClick={handleAdd}>
        Add New Donor
      </button>
      <h1 className="view-donors-title">Our Generous Donors</h1>
      {donors.length === 0 ? (
        <p className="no-donors-message">No donors available yet.</p>
      ) : (
        <div className="donors-grid">
          {donors.map((donor) => (
            <div className="donor-card" key={donor.id}>
              <div className="donor-header">
                <h2 className="donor-name">{donor.donor_name}</h2>
                <p className="donor-frequency">{donor.frequency} Donor</p>
              </div>
              <div className="donor-details">
                <p className="donor-email">
                  <span role="img" aria-label="email">
                    📧
                  </span>{" "}
                  {donor.donor_email || "Not Provided"}
                </p>
                <p className="donor-phone">
                  <span role="img" aria-label="phone">
                    📞
                  </span>{" "}
                  {donor.donor_phone || "Not Provided"}
                </p>
                <p className="donor-amount">
                  <span role="img" aria-label="amount">
                    💵
                  </span>{" "}
                  ${donor.amount}
                </p>
                <p className="donor-date">
                  <span role="img" aria-label="date">
                    📅
                  </span>{" "}
                  {new Date(donor.date).toLocaleDateString()}
                </p>
              </div>
              <div className="donor-actions">
                <button className="edit-button" onClick={() => handleEdit(donor)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(donor)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
