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
import { db } from "../api/firebase-config";
import {
  collection,
  // getCountFromServer,
  onSnapshot,
  query,
} from "firebase/firestore";

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

  const [notif, setNotif] = useState(null);

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
    if (!loading && !!currentUser) setUid(currentUser.uid);
  }, [loading, currentUser]);

  useEffect(() => {
    const notifRef = collection(db, `users/${uid}/notifications`);
    const q = query(notifRef);
    // const sub = async () => {
    //   setNotif(await getCountFromServer(q));
    // };
    // sub();
    onSnapshot(q, (snapshot) => {
      setNotif(snapshot.size);
      // console.log(notif);
    });
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
              className={({ isActive }) => {
                if (isActive) {
                  if (windowSize[0] <= 1024) {
                    return "button-active";
                  } else {
                    return "button-active w-full";
                  }
                } else {
                  if (windowSize[0] <= 1024) {
                    return "button";
                  } else {
                    return "button w-full";
                  }
                }
              }}
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
                className={({ isActive }) => {
                  if (isActive) {
                    if (windowSize[0] <= 1024) {
                      return "button-active";
                    } else {
                      return "button-active w-full";
                    }
                  } else {
                    if (windowSize[0] <= 1024) {
                      return "button";
                    } else {
                      return "button w-full";
                    }
                  }
                }}
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
                className={({ isActive }) => {
                  if (isActive) {
                    if (windowSize[0] <= 1024) {
                      return "button-active";
                    } else {
                      return "button-active w-full";
                    }
                  } else {
                    if (windowSize[0] <= 1024) {
                      return "button";
                    } else {
                      return "button w-full";
                    }
                  }
                }}
                to={"/" + currentUser.displayName}
              >
                <div className="avatar float-left">
                  <div className="w-10 rounded-full">
                    <img src={currentUser.photoURL} />
                  </div>
                </div>

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
              className={({ isActive }) => {
                if (isActive) {
                  if (windowSize[0] <= 1024) {
                    return "button-active";
                  } else {
                    return "button-active w-full";
                  }
                } else {
                  if (windowSize[0] <= 1024) {
                    return "button";
                  } else {
                    return "button w-full";
                  }
                }
              }}
              to="/Notifications"
            >
              {notif === 0 || notif === null ? (
                <RiNotification3Line className="float-left text-4xl" />
              ) : (
                <div className="indicator float-left">
                  <RiNotification3Line className="float-left text-4xl" />
                  <div className="badge-primary badge badge-lg indicator-item">
                    {notif}
                  </div>
                </div>
              )}

              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-4 text-3xl font-normal">
                  Notificaciones
                </p>
              )}
            </NavLink>
            {/* 
              Shop button
              @todo Turn it into a ko-fi donation button 
            */}
            <NavLink
              className={({ isActive }) => {
                if (isActive) {
                  if (windowSize[0] <= 1024) {
                    return "button-active";
                  } else {
                    return "button-active w-full";
                  }
                } else {
                  if (windowSize[0] <= 1024) {
                    return "button";
                  } else {
                    return "button w-full";
                  }
                }
              }}
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
              className={({ isActive }) => {
                if (isActive) {
                  if (windowSize[0] <= 1024) {
                    return "button-active";
                  } else {
                    return "button-active w-full";
                  }
                } else {
                  if (windowSize[0] <= 1024) {
                    return "button";
                  } else {
                    return "button w-full";
                  }
                }
              }}
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
          <div className="fixed bottom-2 left-0">
            <button
              className="button tooltip"
              data-tip="log-out"
              onClick={handleLogout}
            >
              <HiLogout />
            </button>
          </div>
        </nav>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
