import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Home from '../components/Home';
import Layout from './Layout';
import LognSignPage from '../components/LognSign';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LognSignPage/>,
      },
      {
        path: "/home",
        element: <Home/>,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
