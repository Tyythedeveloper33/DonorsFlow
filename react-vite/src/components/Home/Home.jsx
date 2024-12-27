import "./Home.css";
import { useSelector , useDispatch} from "react-redux";
import { useEffect } from "react";
import {thunkLoadDonations }from "../../redux/session"
import { useNavigate } from "react-router-dom";

export default function Home() {
 const dispatch = useDispatch()
 const sessionUser = useSelector((state) => state.session.user);
 const navigate = useNavigate()
 let username
 let totalDonations
 let totalAmtDonations
 let totalDonors
 let donorTotal
 if(sessionUser && sessionUser.id){
  username = sessionUser.username
  totalDonors = sessionUser.donors.length

    totalAmtDonations = sessionUser.donors.reduce((total, donor) => {
    // Sum donations for each donor
     donorTotal = donor.donations.reduce((donationTotal, donation) => {
      return donationTotal + donation.amount;
    }, 0);

    return total + donorTotal;
  }, 0);

 }

 useEffect(() => {


            dispatch(thunkLoadDonations(sessionUser.id));


}, [username, totalDonations]);
const viewDonations = ()=> {
 navigate('/donors')
}

  return (
    <div className="home-dashboard">
      <h1 className="welcome-header">Welcome back, <span>{username}</span>!</h1>

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
        <table>
          <thead>
              <th>Total Donations</th>
              <th>Date</th>
              <th>Active Subscriptions</th>
              <th>Manage</th>

          </thead>
          <tbody>
            <tr>
              <td>$500</td>
              <td>$5.00</td>
              <td>$2.00</td>
              <td><button>Manage Subscriptions</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
