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
import { Tooltip } from "@mui/material";

const Navbar = () => {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
      console.log(window.innerWidt);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      console.log("user logged out");
      navigate("/Login");
    });
  };

  if (loading) return <></>;

  return (
    <div>
      {!!currentUser && currentUser.displayName != null ? (
        <nav className="navbar">
          <div>
            <NavLink to="/Home">
              <img src={logo} className="nav-logo" alt=""></img>
            </NavLink>
          </div>

          <div className="nav-buttons">
            <NavLink
              className="button md:button-still active:button-active"
              to="/Home"
            >
              <HiOutlineHome className="float-left " />{" "}
              {windowSize[0] <= 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-5 text-3xl font-normal">Home</p>
              )}
            </NavLink>
            {currentUser.photoURL ===
            "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a" ? (
              <NavLink
                to={"/" + currentUser.displayName}
                className="button md:button-still active:button-active"
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
                className="button md:button-still active:button-active md:p-3 lg:p-4"
                to={"/" + currentUser.displayName}
              >
                <img
                  src={currentUser.photoURL}
                  alt="yo"
                  className="float-left w-9 rounded-full"
                />
                {windowSize[0] <= 1024 ? (
                  <></>
                ) : (
                  <p className="float-left pl-4 text-3xl font-normal">
                    {currentUser.displayName}
                  </p>
                )}
              </NavLink>
            )}
            <NavLink
              className="button md:button-still active:button-active"
              to="/Shop"
            >
              <HiOutlineShoppingCart className="float-left " />
              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-4 text-3xl font-normal">Tienda</p>
              )}
            </NavLink>
            <NavLink
              className="button md:button-still active:button-active"
              to="/Ajustes"
            >
              <HiOutlineCog className="float-left " />
              {windowSize[0] < 1024 ? (
                <></>
              ) : (
                <p className="float-left pl-4 text-3xl font-normal">Ajustes</p>
              )}
            </NavLink>
          </div>

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
