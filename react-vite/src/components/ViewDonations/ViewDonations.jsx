import "./ViewDonations.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // To access URL params and navigate
import { thunkLoadDonations } from "../../redux/session";

export default function ViewDonations() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation to a new page

  // Get the donor ID from the URL
  const { id } = useParams();
  console.log("donorId", id);

  // Access the session user and their donors
  const sessionUser = useSelector((state) => state.session.user);
  const [donations, setDonations] = useState([]);
  const [donorData, setDonorData] = useState(null); // Store donor data in state

  useEffect(() => {
    // Log sessionUser.donors for debugging
    console.log("sessionUser.donors", sessionUser?.donors);

    if (sessionUser?.donors && id) {
      // Find the donor that matches the donorId from the URL
      const donor = sessionUser.donors.find((donor) => donor.id === parseInt(id));

      if (donor) {
        // Log the found donor for debugging
        console.log("Found donor", donor);

        // If the donor is found, set the donations and donor info
        setDonorData(donor);
        setDonations(donor.donations || []);
      } else {
        console.log("No donor found with the given ID.");
        // In case no donor matches, reset the donations state and donor info
        setDonorData(null);
        setDonations([]);
      }
    }
  }, [sessionUser, id]);

  // Handle the Make Donation button click
  const handleMakeDonationClick = () => {
    // Navigate to the donation page (replace with actual donation page path)
    navigate("/make-donation");
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
                <h3>{donorData ? donorData.name : "Anonymous"}</h3> {/* Render donor name only when donorData is available */}
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
      {/* Make Donation Button */}
      <button className="make-donation-button" onClick={handleMakeDonationClick}>
        Make Donation
      </button>
    </div>
  );
}
