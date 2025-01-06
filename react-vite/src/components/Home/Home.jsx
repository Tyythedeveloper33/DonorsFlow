import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkLoadDonorData } from "../../redux/session";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorSubscriptions, setDonorSubscriptions] = useState([]);
  const [donors, setDonors] = useState([]); // New state to store fetched donors

  let username;
  let totalAmtDonations = 0;
  let totalDonors = 0;

  if (sessionUser && sessionUser.id) {
    username = sessionUser.username;
    totalDonors = donors.length; // Use the length of fetched donors
    totalAmtDonations = donors?.reduce((total, donor) => {
      const donorTotal = donor.donations?.reduce((donationTotal, donation) => {
        return donationTotal + donation.amount;
      }, 0);
      return total + donorTotal;
    }, 0);
  }

  // Fetch donors when the component mounts
  useEffect(() => {
    if (sessionUser?.id) {
      const fetchDonors = async () => {
        try {
          const response = await fetch(`/api/donor/user/${sessionUser.id}`); // Fetch from backend route
          if (!response.ok) {
            throw new Error('Failed to fetch donors');
          }
          const data = await response.json(); // Parse JSON response
          console.log(data); // Visualize the response in the console
          setDonors(data); // Store the response data in state
        } catch (error) {
          console.error("Error fetching donors:", error);
        }
      };

      fetchDonors();
    }
  }, [sessionUser]);

  const handleDonorSelect = async (e) => {
    const donorId = e.target.value;
    if (!donorId) {
      setSelectedDonor(null);
      setDonorSubscriptions([]);
      return;
    }

    const donor = donors.find((d) => d.id === parseInt(donorId)); // Use the fetched donors
    setSelectedDonor(donor);

    try {
      const updatedDonor = await dispatch(thunkLoadDonorData(donorId));
      if (updatedDonor?.subscriptions) {
        setDonorSubscriptions(updatedDonor.subscriptions);
      } else {
        setDonorSubscriptions([]);
      }
    } catch (error) {
      console.error("Error loading donor data:", error);
      setDonorSubscriptions([]);
    }
  };

  const manageSubscription = (subscriptionId) => {
    navigate(`/subscriptions/${subscriptionId}`);
  };

  const viewDonations = () => {
    navigate("/donors");
  };

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
              <h3>Donations</h3>
              <button onClick={viewDonations}>View/Add Donors</button>
              <div className="stat-value">
                <p>{totalDonors}</p>
                <span>Total: ${totalAmtDonations}</span>
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

            <div className="donor-select">
              <label>Select Donor</label>
              <select
                onChange={handleDonorSelect}
                value={selectedDonor ? selectedDonor.id : ""}
              >
                <option value="">-- Select a Donor --</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name}
                  </option>
                ))}
              </select>
            </div>

            {donorSubscriptions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Total Donations</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Subscription Amount</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {donorSubscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td>
                        $
                        {subscription.donations?.reduce(
                          (sum, donation) => sum + donation.amount,
                          0
                        )}
                      </td>
                      <td>
                        {new Date(subscription.start_date).toLocaleDateString()}
                      </td>
                      <td>{subscription.end_date ? "Inactive" : "Active"}</td>
                      <td>${subscription.amount}</td>
                      <td>
                        <button
                          onClick={() => manageSubscription(subscription.id)}
                        >
                          Manage Subscriptions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedDonor ? (
              <p>No subscriptions found for this donor.</p>
            ) : null}
          </div>
        </>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}
