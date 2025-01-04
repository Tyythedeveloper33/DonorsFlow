import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkLoadDonations } from "../../redux/session";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const [selectedDonor, setSelectedDonor] = useState(null); // For storing the selected donor
  const [donorSubscriptions, setDonorSubscriptions] = useState([]); // For storing subscriptions of selected donor

  let username;
  let totalDonations = 0;
  let totalAmtDonations = 0;
  let totalDonors = 0;
  let donorTotal = 0;

  // Only proceed if there is a sessionUser
  if (sessionUser && sessionUser.id) {
    username = sessionUser.username;
    totalDonors = sessionUser.donors ? sessionUser.donors.length : 0;

    totalAmtDonations = sessionUser.donors?.reduce((total, donor) => {
      donorTotal = donor.donations?.reduce((donationTotal, donation) => {
        return donationTotal + donation.amount;
      }, 0);

      return total + donorTotal;
    }, 0);
  }

  useEffect(() => {
    if (sessionUser?.id && sessionUser.donors) {
      // Only load donations if they haven't been loaded already
      if (!sessionUser.donors.length) {
        dispatch(thunkLoadDonations(sessionUser.id));
      }
    }
  }, [sessionUser]);

  const handleDonorSelect = (e) => {
    const donorId = e.target.value;
    const donor = sessionUser.donors.find((d) => d.id === parseInt(donorId));
    setSelectedDonor(donor);

    // Load subscriptions for the selected donor
    if (donor) {
      setDonorSubscriptions(donor.subscriptions);
    }
  };

  const manageSubscription = (subscriptionId) => {
    navigate(`/subscriptions/${subscriptionId}`);
  };

  const viewDonations = () => {
    navigate("/donors");
  };

  // Redirect to login if there's no sessionUser
  useEffect(() => {
    if (!sessionUser) {
      navigate("/login");
    }
  }, [sessionUser, navigate]);

  return (
    <div className="home-dashboard">
      {sessionUser ? (
        <>
          <h1 className="welcome-header">
            Welcome back, <span>{username}</span>!
          </h1>

          <div className="stats-container">
            <div className="stat-card">
              <h3> Donations</h3>
              <button onClick={viewDonations}>View/Add Donors</button>
              <div className="stat-value">
                <p>{totalDonors}</p>
                <span>total ${totalAmtDonations}</span>
              </div>
            </div>
            <div className="stat-card">
              <h3>Profile</h3>
              <div className="stat-value">
                <p>20</p>
                <span>$500</span>
              </div>
            </div>
          </div>

          <div className="recent-donations">
            <h3>Subscribers</h3>

            {/* Dropdown for selecting a donor */}
            <div className="donor-select">
              <label>Select Donor</label>
              <select
                onChange={handleDonorSelect}
                value={selectedDonor ? selectedDonor.id : ""}
              >
                <option value="">-- Select a Donor --</option>
                {sessionUser.donors?.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display subscriptions for the selected donor */}
            {selectedDonor && (
              <table>
                <thead>
                  <tr>
                    <th>Total Donations</th>
                    <th>Date</th>
                    <th>Active Subscriptions</th>
                    <th>Subscription Amount</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>

                  {donorSubscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                     {subscription ? console.log(JSON.stringify(subscription)) : ''}  {/* Corrected the logging */}
                      <td>
                        ${subscription.donations?.reduce(
                          (sum, donation) => sum + donation.amount,
                          0
                        )}
                      </td>
                      <td>{new Date(subscription.start_date).toLocaleDateString()}</td>
                      <td>{subscription.end_date ? "Inactive" : "Active"}</td>
                      <td>${subscription.amount}</td>
                      <td>
                        <button onClick={() => manageSubscription(subscription.id)}>
                          Manage Subscriptions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}
