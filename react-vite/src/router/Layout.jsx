import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (!sessionUser) {
      navigate("/"); // Redirect to home if user is not authenticated
    }
  }, [sessionUser, navigate]);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {/* Wrapper to push content below the fixed navbar */}
        <div className="content-wrapper">
          {isLoaded && <Outlet />}
        </div>
        <Modal />
      </ModalProvider>
    </>
  );
}
