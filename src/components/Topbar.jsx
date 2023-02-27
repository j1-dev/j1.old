import React from "react";
import logo from "../logo.png";
import { useAuth } from "../api/authContext";
import { auth } from "../api/firebase-config";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Avatar } from "@mui/material";

/**
 * @component
 * Renders the Topbar component which displays the logo, title and navigation options for the app.
 *
 * @function
 * @name Topbar
 *
 * @return {JSX.Element} JSX element representing the Topbar component.
 *
 * @requires React from react
 * @requires logo from ../logo.png
 * @requires auth from ../api/firebase-config
 * @requires useNavigate from react-router-dom
 * @requires FiArrowLeft from react-icons/fi
 * @requires useAuth from ../api/authContext
 *
 */

const Topbar = () => {
  /**
   * Gets the current user from the Firebase authentication service.
   * @type {firebase.User}
   */
  const currentUser = auth.currentUser;

  /**
   * A hook from a custom `useAuth` hook that provides loading status for authentication data.
   * @type {boolean}
   */
  const { loading } = useAuth();

  /**
   * The currently authenticated user.
   * @type {firebase.User | null}
   */
  const user = auth.currentUser;

  /**
   * A function for navigating between pages using React Router.
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * The current path of the window.
   * @type {string}
   */
  const path = window.location.pathname;

  /**
   * Renders a window title based on the current pathname.
   *
   * @function
   * @param {string} pathname - The current pathname of the window.
   * @returns {JSX.Element} A window title element based on the current pathname.
   */
  const renderWindowTitle = (pathname) => {
    switch (pathname) {
      case "/":
      case "/Home":
        // Render the 'Home' title for the home page.
        return <p className="pt-5 text-3xl font-bold">Home</p>;
      case `/${user.displayName}`:
        // Render the user's display name as the title for their profile page.
        return <p className="pt-5 text-3xl font-bold">{user.displayName}</p>;
      case "/Shop":
        // Render the 'Tienda' title for the shop page.
        return <p className="pt-5 text-3xl font-bold">Tienda</p>;
      case "/Ajustes":
        // Render the 'Ajustes' title for the settings page.
        return <p className="pt-5 text-3xl font-bold">Ajustes</p>;
      default:
        if (pathname.includes("/post"))
          // Render the 'Post' title for the post detail page.
          return <p className="pt-5 text-3xl font-bold">Post</p>;
        // Render the title based on the pathname, removing the leading forward slash.
        else
          return <p className="pt-5 text-3xl font-bold">{pathname.slice(1)}</p>;
    }
  };

  /**
   * Renders the back button or user avatar depending on the pathname
   *
   * @function
   * @param {string} pathname - The current pathname
   * @returns {JSX.Element} - Returns a JSX Element that represents a back button or a user avatar
   */
  const renderBackButton = (pathname) => {
    if (pathname === "/Home" || pathname === "/") {
      return (
        <Avatar
          className="m-2"
          alt="lol"
          src={currentUser.photoURL}
          sx={{ width: "65px", height: "65px" }}
        />
      );
    } else {
      return (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 text-5xl"
        >
          <FiArrowLeft />
        </button>
      );
    }
  };

  if (loading) return null;

  return (
    <div className="h-20 ">
      {!!currentUser && currentUser.displayName !== null ? (
        <div className="">
          <div className="float-right w-1/3">
            <img
              src={logo}
              alt="J1"
              onClick={() => navigate("/Home")}
              className="float-right h-20 p-2"
            />
          </div>
          <div className="float-right w-1/3">{renderWindowTitle(path)}</div>
          <div className="float-left w-1/3">{renderBackButton(path)}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Topbar;
