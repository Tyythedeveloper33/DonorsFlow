import "./ViewDonors.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { thunkUpdateDonor, thunkDeleteDonor, thunkLoadDonations } from "../../redux/session";
import { useModal } from "../../context/Modal";
import EditDonorModal from "../EditDonorModal/EditDonorModal";
import AddDonorModal from "../AddDonorModal/AddDonorModal";
import { useNavigate } from "react-router-dom";

export default function ViewDonors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleEdit = async (donor) => {
    setModalContent(
      <EditDonorModal
        donor={donor}
        onSave={async (updatedDonor) => {
          setDonors((prevDonors) =>
            prevDonors.map((d) => (d.id === updatedDonor.id ? updatedDonor : d))
          );
          try {
            await dispatch(thunkUpdateDonor(updatedDonor));
            dispatch(thunkLoadDonations(sessionUser.id));
          } catch (error) {
            console.error("Failed to update donor:", error);
          }
        }}
      />
    );
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

  const handleDelete = async (donor) => {
    try {
      // Dispatch the delete action and wait for it to complete
      await dispatch(thunkDeleteDonor(parseInt(sessionUser.id), donor));

      // Update the local state to remove the deleted donor
      setDonors((prevDonors) => prevDonors.filter((d) => d.id !== donor.id));
    } catch (error) {
      console.error("Failed to delete donor:", error);
    }
  };

  const handleViewDonations = (donorId) => {
    navigate(`/donors/${donorId}/donations`);
  };

  const handleManageSubscriptions = (donorId) => {
    navigate(`/donors/${donorId}/subscriptions`);
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
                <h2 className="donor-name">{donor.name}</h2>
              </div>
              <div className="donor-details">
                <p className="donor-email">
                  <span role="img" aria-label="email">
                    📧
                  </span>{" "}
                  {donor.email || "Not Provided"}
                </p>
                <p className="donor-phone">
                  <span role="img" aria-label="phone">
                    📞
                  </span>{" "}
                  {donor.phone || "Not Provided"}
                </p>
              </div>
              <div className="donor-actions">
                <div className="donor-actions-row">
                  <button className="edit-button" onClick={() => handleEdit(donor)}>
                    Edit
                  </button>
                  <button
                    className="view-donations-button"
                    onClick={() => handleViewDonations(donor.id)}
                  >
                    Manage Donations
                  </button>
                </div>
                <div className="donor-actions-row">
                  <button
                    className="manage-subscriptions-button"
                    onClick={() => handleManageSubscriptions(donor.id)}
                  >
                    Manage Subscriptions
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(donor)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
