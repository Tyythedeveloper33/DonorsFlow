import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkLoadDonorData, thunkAddDonation } from "../../redux/session"; // Update the thunk name here
import { useModal } from "../../context/Modal";
import AddDonationModal from "../AddDonationModal/AddDonationModal";
import GenerateStatementModal from "../GenerateStatementModal";
import "./ViewDonations.css";

export default function ViewDonations() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const donor = useSelector((state) =>
    state.session.user.donors ? state.session.user.donors.find((d) => d.id === parseInt(id)) : null
  );
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [showStatements, setShowStatements] = useState(false);
  const [donorName, setDonorName] = useState(null); // Add state to store donor name
  const { setModalContent } = useModal();

  // Load donor data when the page loads
  useEffect(() => {
    const loadDonorData = async () => {
      if (id) {
        const donorData = await dispatch(thunkLoadDonorData(id)); // Wait for the donor data to load
        if (donorData) {
          setDonorName(donorData.name); // Set donor name from the response
          console.log("Donor Name:", donorData.name); // Log donor name
        }
      }
      if (sessionUser?.donors && id) {
        const donor = sessionUser.donors.find((donor) => donor.id === parseInt(id));
        if (donor) {
          setDonations(donor.donations || []);
        }
        setLoadingDonations(false);
      }
    };

    loadDonorData();
  }, [dispatch, id, sessionUser]);

  const handleMakeDonationClick = () => {
    setModalContent(
      <AddDonationModal
        onAdd={async (newDonation) => {
          setLoadingDonations(true);
          const response = await dispatch(thunkAddDonation(newDonation, sessionUser.id));
          if (response && !response.errors) {
            setDonations((prevDonations) => [...prevDonations, response]);
          } else {
            console.error("Failed to add donation:", response.errors);
          }
          setLoadingDonations(false);
        }}
        onClose={() => setModalContent(null)}
      />
    );
  };

  const handleGenerateStatementClick = () => {
    setModalContent(
      <GenerateStatementModal
        onGenerate={(dateRange) => {
          console.log("Generating statement for date range:", dateRange);
        }}
        id={id}
      />
    );
  };

  const handleViewStatementsClick = async () => {
    setShowStatements(!showStatements);
  };

  const getDonationsForStatement = (statement) => {
    const startDate = new Date(statement.start_date);
    const endDate = new Date(statement.end_date);
    return donations.filter((donation) => {
      const donationDate = new Date(donation.date);
      return donationDate >= startDate && donationDate <= endDate;
    });
  };

  return (
    <div className="view-donations-container">
      <h1 className="view-donations-title">Donation History</h1>
      <div className="donations-list-container">
        {loadingDonations ? (
          <p>Loading donations...</p>
        ) : (
          <div className="donations-list">
            {donations.length === 0 ? (
              <p className="no-donations-message">No donations to display.</p>
            ) : (
              donations.map((donation) => (
                <div className="donation-card" key={donation.id}>
                  <div className="donation-header">
                    <h3>{donorName || "Anonymous"}</h3> {/* Use donor name here */}
                    <p className="donation-date">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="donation-details">
                    <span className="donation-label">Amount: {donation.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button className="generate-statement-button" onClick={handleGenerateStatementClick}>
        Generate Statement
      </button>
      <button className="view-statements-button" onClick={handleViewStatementsClick}>
        {showStatements ? "Hide Statements" : "View Statements"}
      </button>
      <button className="make-donation-button" onClick={handleMakeDonationClick}>
        Make Donation
      </button>

      {showStatements && (
        <div className="statements-list">
          {donor?.statements?.length === 0 ? (
            <p>No statements available.</p>
          ) : (
            donor.statements.map((statement) => (
              <div className="statement-card" key={statement.id}>
                <h2 className="statement-header">
                  Statement for{" "}
                  {new Date(statement.start_date).toLocaleDateString()} -{" "}
                  {new Date(statement.end_date).toLocaleDateString()}
                </h2>
                <p>
                  <strong>Generated On:</strong>{" "}
                  {new Date(statement.generated_on).toLocaleDateString()}
                </p>
                <div className="donations-for-statement">
                  {getDonationsForStatement(statement).length === 0 ? (
                    <p>No donations in this date range.</p>
                  ) : (
                    getDonationsForStatement(statement).map((donation) => (
                      <div className="donation-card" key={donation.id}>
                        <div className="donation-header">
                          <p className="donation-date">
                            {new Date(donation.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="donation-details">
                          <span className="donation-label">Amount: {donation.amount}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
