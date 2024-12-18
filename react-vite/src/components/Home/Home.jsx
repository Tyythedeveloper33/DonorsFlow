import "./Home.css";
import { useSelector , useDispatch} from "react-redux";
import { useEffect } from "react";
import {thunkLoadDonations }from "../../redux/session"

export default function Home() {
 const dispatch = useDispatch()

 const sessionUser = useSelector((state) => state.session.user);
 useEffect(() => {
    // console.log('Current sessionUser:', sessionUser); // Log the sessionUser object
    if (sessionUser?.id) {
        // console.log('Dispatching thunkLoadDonations with user ID:', sessionUser.id); // Log the user ID
        try {
            dispatch(thunkLoadDonations(sessionUser.id));
        } catch (error) {
            console.error('Error dispatching thunkLoadDonations:', error); // Log any errors that occur during dispatch
        }
    } else {
        console.error('sessionUser.id is undefined or null'); // Log if ID is invalid
    }
}, [sessionUser, dispatch]);

  return (
    <div className="home-dashboard">
      <h1 className="welcome-header">Welcome back, <span></span>!</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>My Donations</h3>
          <div className="stat-value">
            <p>10</p>
            <span>$10</span>
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
