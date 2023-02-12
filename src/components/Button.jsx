import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @deprecated
 * nav button (not useful anymore)
 */
const Button = ({ path, children }) => {
  const expand = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <NavLink
      onMouseEnter={expand}
      to={path}
      className={({ isActive }) => (isActive ? "button-active" : "button")}
    >
      {children}
    </NavLink>
  );
};

export default Button;
