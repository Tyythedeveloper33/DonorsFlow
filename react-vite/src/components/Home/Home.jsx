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
 if(sessionUser){
  username = sessionUser.username
  totalDonations = sessionUser.donations.length
  totalAmtDonations = sessionUser.donations.reduce((total, donation) => {
    return total + donation.amount;
  }, 0);


 }

 useEffect(() => {


            dispatch(thunkLoadDonations(sessionUser.id));


}, [username, totalDonations]);
const viewDonations = ()=> {
 navigate('/donations')
}

  return (
    <div className="home-dashboard">
      <h1 className="welcome-header">Welcome back, <span>{username}</span>!</h1>

      <div className="stats-container">
        <div className="stat-card">

          <h3> Donations</h3>
          <button onClick={viewDonations}>View Donors</button>
          <div className="stat-value">
            <p>{totalDonations}</p>
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
        <h3>Recent Donations</h3>
        <table>
          <thead>
            <tr>
              <th>Home</th>
              <th>Total Donations</th>
              <th>Date</th>
              <th>Active Subscriptions</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>My Donations</td>
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
