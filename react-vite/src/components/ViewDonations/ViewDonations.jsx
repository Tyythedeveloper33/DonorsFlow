import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkLoadDonations, thunkAddDonation } from "../../redux/session";
import { useModal } from "../../context/Modal";
import AddDonationModal from "../AddDonationModal/AddDonationModal";
import GenerateStatementModal from "../GenerateStatementModal";
import "./ViewDonations.css";

export default function ViewDonations() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const statements = useSelector(
    (state) =>
      state.session.user.donors.find((donor) => donor.id === parseInt(id))?.statements ||
      []
  );

  const [donations, setDonations] = useState([]);
  const [donorData, setDonorData] = useState(null);
  const [showStatements, setShowStatements] = useState(false); // State for toggling statement visibility

  const { setModalContent } = useModal();

  useEffect(() => {
    if (sessionUser?.donors && id) {
      const donor = sessionUser.donors.find((donor) => donor.id === parseInt(id));
      if (donor) {
        setDonorData(donor);
        setDonations(donor.donations || []);
      }
    }
  }, [sessionUser, id]);

  const handleMakeDonationClick = () => {
    setModalContent(
      <AddDonationModal
        onAdd={async (newDonation) => {
          const response = await dispatch(thunkAddDonation(newDonation, sessionUser.id));
          if (response && !response.errors) {
            setDonations((prevDonations) => [...prevDonations, response]);
            console.log("Updated donations:", [...donations, response]);
          } else {
            console.error("Failed to add donation:", response.errors);
          }
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
    // Toggle the statement list visibility
    setShowStatements(!showStatements);
  };

  // Filter donations based on the statement date range
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
                  <span className="donation-label">Amount: {donation.amount}</span>
                </div>
              </div>
            ))
          )}
        </div>
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
          {statements.length === 0 ? (
            <p>No statements available.</p>
          ) : (
            statements.map((statement) => (
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
                {/* Show donations for this statement */}
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
