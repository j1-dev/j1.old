import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @deprecated
 * @component
 * React component for rendering a button that navigates to the specified path using React Router.
 *
 * @function
 * @name Button
 *
 * @param {object} props - The props object.
 * @param {string} props.path - The path to navigate to when the button is clicked.
 * @param {ReactNode} props.children - The child elements to be rendered inside the button.
 *
 * @returns {JSX.Element} The rendered React element representing the button.
 *
 * @requires react
 * @requires react-router-dom
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
