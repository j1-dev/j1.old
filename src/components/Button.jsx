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
  /**
   * Prevents the default behavior of an event and logs the event object to the console.
   *
   * @function
   * @name expand
   * @param {Event} e - The event object to be processed.
   * @returns {undefined} This function does not return anything.
   */
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
