import React, { useState } from "react";
import logo from "../logo.png";
import { useAuth } from "../api/authContext";
import { auth } from "../api/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { slide as Menu } from "react-burger-menu";
import { NavLink } from "react-router-dom";
import { RiNotification3Line } from "react-icons/ri";
import {
  HiLogout,
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
  HiOutlineCog,
} from "react-icons/hi";

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

const Topbar = ({ pageWrapId, outerContainerId }) => {
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

  const [isOpen, setOpen] = useState(false);

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
      case "/Notifications":
        // Render the 'Ajustes' title for the Notifications page.
        return <p className="pt-5 text-2xl font-bold">Notificaciones</p>;
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
        <div
          className="avatar float-left m-3"
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          <div className="w-14 rounded-full">
            <img src={currentUser.photoURL} alt="loading..." />
          </div>
        </div>
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
          <Menu
            isOpen={isOpen}
            onStateChange={(s) => setOpen(s.isOpen)}
            pageWrapId={pageWrapId}
            outerContainerId={outerContainerId}
            className="overflow-visible bg-white shadow-lg"
            width={"350px"}
            burgerButtonClassName={"hidden"}
            bodyClassName={"overflow-visible"}
            htmlClassName={"overflow-visible"}
          >
            <div className="relative">
              <div className="avatar absolute top-8 left-8">
                <div className="w-24 rounded-full">
                  <img src={user.photoURL} alt="loading..." />
                </div>
              </div>
              <Link
                to={`/${currentUser.displayName}`}
                className="absolute top-16 left-40 text-4xl font-semibold hover:underline"
              >
                {currentUser.displayName}
              </Link>
            </div>
            <hr className="mt-20" />
            <ul className="navbar left-5 top-60 w-[310px]">
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Home">
                  <HiOutlineHome className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Home</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to={"/" + user.displayName}>
                  <HiOutlineUserCircle className="float-left text-3xl " />
                  <p className="pl-5 text-3xl font-normal">Perfil</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Notifications">
                  <RiNotification3Line className="float-left text-3xl " />
                  <p className="pl-5 text-3xl font-normal">Notificaciones</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Shop">
                  <HiOutlineShoppingCart className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Tienda</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Settings">
                  <HiOutlineCog className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Ajustes</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9  transition-colors hover:text-blue-500"
              >
                <NavLink onClick={handleLogout}>
                  <HiLogout className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Logout</p>
                </NavLink>
              </li>
            </ul>
          </Menu>
        </div>
      ) : null}
    </div>
  );
};

export default Topbar;
