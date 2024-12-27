import "./ViewDonations.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkLoadDonations, thunkAddDonation } from "../../redux/session";
import { useModal } from "../../context/Modal"; // Importing useModal context
import AddDonationModal from "../AddDonationModal/AddDonationModal"; // Assuming you create this modal component

export default function ViewDonations() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const [donations, setDonations] = useState([]);
  const [donorData, setDonorData] = useState(null);
  const { setModalContent } = useModal(); // Using modal context

  useEffect(() => {
    if (sessionUser?.donors && id) {
      const donor = sessionUser.donors.find((donor) => donor.id === parseInt(id));
      if (donor) {
        setDonorData(donor);
        setDonations(donor.donations || []);
      }
    }
  }, [sessionUser, id]);

  // Handle the Make Donation button click
  const handleMakeDonationClick = () => {
    setModalContent(
      <AddDonationModal
        onAdd={async (newDonation) => {
          // Dispatch the thunk and wait for the response
          const response = await dispatch(thunkAddDonation(newDonation,sessionUser.id));

          if (response && !response.errors) {
            // Update local state with the new donation
            setDonations((prevDonations) => [...prevDonations, response]);
            console.log("donations", donations);


          } else {
            console.error("Failed to add donation:", response.errors);
          }
        }}
        onClose={() => setModalContent(null)} // Close modal
      />
    );
  };

  return (
    <div className="view-donations-container">
      <h1 className="view-donations-title">Donation History</h1>
      <div className="donations-list">
        {donations.length === 0 ? (
          <p className="no-donations-message">No donations to display.</p>
        ) : (
          donations.map((donation) => (
            <div className="donation-card" key={donation.id}>
              <div className="donation-header">
                <h3>{donorData ? donorData.name : "Anonymous"}</h3>
                <p className="donation-date">{new Date(donation.date).toLocaleDateString()}</p>
              </div>
              <div className="donation-details">
                <p>
                  <span className="donation-label">Amount:</span> ${donation.amount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="generate-statement-button">Generate Statement</button>
      <button className="make-donation-button" onClick={handleMakeDonationClick}>
        Make Donation
      </button>
    </div>
  );
}
