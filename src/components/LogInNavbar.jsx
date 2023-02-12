import React from "react";
import { NavLink } from "react-router-dom";

/**
 * This component lets the user chose wether they want to log in or Register
 */
const LogInNavbar = () => {
  return (
    <nav
      className=" z-50 mx-0 list-none  overflow-hidden
                      bg-white pt-96 transition-all"
    >
      <div className="inline-flex">
        <NavLink to="/Login">Login</NavLink>
        <NavLink to="/Register">Register</NavLink>
      </div>
    </nav>
  );
};

export default LogInNavbar;
