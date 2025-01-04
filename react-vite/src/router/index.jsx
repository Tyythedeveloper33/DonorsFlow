import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Home from '../components/Home';
import Layout from './Layout';
import LognSignPage from '../components/LognSign';
import ViewDonors from '../components/ViewDonors';
import ViewDonations from '../components/ViewDonations'; // Import the new component
import ManageSubscriptions from '../components/ManageSubscriptions'; // Import the new component
import UpdateSubscription from '../components/UpdateSubscriptions'; // Import the new component

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LognSignPage />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/donors",
        element: <ViewDonors />,
      },
      {
        path: "/donors/:id/donations", // Route for viewing donations
        element: <ViewDonations />,
      },
      {
        path: "/donors/:id/subscriptions", // Route for managing subscriptions
        element: <ManageSubscriptions />,
      },
      {
        path: "/subscriptions/:id", // Route for managing subscriptions
        element: <UpdateSubscription />,
      },
    ],
  },
]);
