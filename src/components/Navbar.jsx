import React, { useEffect, useState } from "react";
import { auth } from "../api/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/authContext";
import logo from "../logo.png";
import {
  HiLogout,
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineCog,
} from "react-icons/hi";
import { RiNotification3Line } from "react-icons/ri";
import { Avatar, Tooltip, Badge } from "@mui/material";
import { db } from "../api/firebase-config";
import { collection, getCountFromServer, query } from "firebase/firestore";

/**
 * @component
 * React component for rendering the navigation bar of the website.
 *
 * @function
 * @name Navbar
 *
 * @returns {JSX.Element} The rendered React element representing the navigation bar.
 *
 * @requires react
 * @requires react-router-dom
 * @requires @mui/material
 * @requires ../api/firebase-config
 * @requires ../api/authContext
 * @requires ../logo.png
 */

const Navbar = () => {
  /**
   * Gets the current user from the Firebase authentication service.
   * @type {firebase.User}
   */
  const currentUser = auth.currentUser;

  /**
   * A hook from the React Router package that provides a navigate function for changing the URL programmatically.
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * A hook from a custom `useAuth` hook that provides loading status for authentication data.
   * @type {boolean}
   */
  const { loading } = useAuth();

  /**
   * A state hook that sets the window size as an array of width and height values.
   * @type {Array}
   */
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const [notif, setNotif] = useState(0);

  const [uid, setUid] = useState(null);

  /**
   * A hook from React that sets up a callback for when the window is resized.
   *
   * @function
   * @returns {function} A cleanup function that removes the event listener when the component is unmounted.
   */
  useEffect(() => {
    /**
     * The callback function that updates the window size state whenever the window is resized.
     */
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    // Add an event listener for the window resize event and call the callback function.
    window.addEventListener("resize", handleWindowResize);

    // Remove the event listener when the component is unmounted.
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!loading) setUid(currentUser.uid);
  }, [loading, currentUser]);

  useEffect(() => {
    const notifRef = collection(db, `users/${uid}/notifications`);
    const q = query(notifRef);
    const sub = async () => {
      setNotif(await getCountFromServer(q));
    };
    console.log(notif);
    sub();
  }, [uid]);

  /**
   * Handles the logout button click event by signing out the user and redirecting to the login page.
   *
   * @function
   * @param {object} e The click event object.
   * @returns {undefined}
   */
  const handleLogout = (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      console.log("user logged out");
      navigate("/Login");
    });
  };

  if (loading) return null;

  return (
    <div>
      {/* 
        This checks if the currentUser has loaded and has a displayName and show the component if it does
      */}
      {!!currentUser && currentUser.displayName != null ? (
        <nav className="navbar">
          {/* 
            Logo
          */}
          <div>
            <NavLink to="/Home">
              <img src={logo} className="nav-logo" alt=""></img>
            </NavLink>
          </div>

          {/* 
            Nav buttons
          */}
          <div className="nav-buttons">
            {/* 
              Home button
            */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "button-active" : "button"
              }
              to="/Home"
            >
              <HiOutlineHome className="float-left text-4xl" />{" "}
              {windowSize[0] <= 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-5 text-3xl font-normal">Home</p>
              )}
              {/* 
              Profile button
            */}
            </NavLink>
            {currentUser.photoURL ===
            "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a" ? (
              <NavLink
                to={"/" + currentUser.displayName}
                // className="button md:button-still active:button-active"
                className={({ isActive }) =>
                  isActive ? "button-active" : "button"
                }
              >
                {windowSize[0] >= 1024 ? (
                  <p className="float-left pl-4 text-3xl font-normal">
                    {currentUser.displayName}
                  </p>
                ) : (
                  <></>
                )}
              </NavLink>
            ) : (
              <NavLink
                // className="button md:button-still active:button-active md:p-3 lg:p-4"
                className={({ isActive }) =>
                  isActive ? "button-active p-3" : "button p-3"
                }
                to={"/" + currentUser.displayName}
              >
                {/* <img
                  src={currentUser.photoURL}
                  alt="yo"
                  className="float-left w-11 rounded-full p-0"
                /> */}
                <Avatar
                  className="float-left w-11 p-0"
                  alt="lol"
                  src={currentUser.photoURL}
                  sx={{ width: "44px", height: "44px" }}
                />
                {windowSize[0] <= 1024 ? (
                  <></>
                ) : (
                  <p className="float-left mt-1 pl-4 text-3xl font-normal">
                    {currentUser.displayName}
                  </p>
                )}
              </NavLink>
            )}
            {/* 
              Notifications button
            */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "button-active" : "button"
              }
              to="/Notifications"
            >
              {notif === 0 ? (
                <RiNotification3Line className="float-left text-4xl" />
              ) : (
                <Badge badgeContent={notif.data().count} color="primary">
                  <RiNotification3Line className="float-left text-4xl" />
                </Badge>
              )}

              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-right pl-4 text-3xl font-normal">
                  Notificaciones
                </p>
              )}
            </NavLink>
            {/* 
              Shop button
              @todo Turn it into a ko-fi donation button 
            */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "button-active" : "button"
              }
              to="/Shop"
            >
              <HiOutlineShoppingCart className="float-left text-4xl" />
              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-4 text-3xl font-normal">Tienda</p>
              )}
            </NavLink>
            {/* 
              Settings button
            */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "button-active" : "button"
              }
              to="/Settings"
            >
              <HiOutlineCog className="float-left text-4xl" />
              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-4 text-3xl font-normal">Ajustes</p>
              )}
            </NavLink>
          </div>
          {/* 
            Log out button
          */}
          <div className="fixed bottom-0">
            <Tooltip title="Log-out">
              <button className="button " onClick={handleLogout}>
                <HiLogout />
              </button>
            </Tooltip>
          </div>
        </nav>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
