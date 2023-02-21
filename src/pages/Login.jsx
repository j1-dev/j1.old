import React, { useState } from "react";
import { useAuth } from "../api/authContext";
import LogInNavbar from "../components/LogInNavbar";
import { Tilt } from "../api/TiltApi";

/**
 * @component
 * Renders the login page with a form for users to input their email and password and submit
 * to log in. Also includes a Tilt component for the "Log-in" text.
 *
 * @function
 * @name Login
 *
 * @return {JSX.Element} JSX element representing the Login component.
 *
 * @requires React from react
 * @requires useState from react
 * @requires useAuth from ../api/authContext
 * @requires LogInNavbar from ../components/LogInNavbar
 * @requires Tilt from ../api/TiltApi
 */

const Login = () => {
  /**
   * User object that holds email and password values.
   * @type {object}
   */
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  /**
   * Object that contains the login method from useAuth hook.
   * @type {object}
   */
  const { login } = useAuth();

  /**
   * Handles changes to the input fields in the form by updating the user state object
   * with the new values.
   *
   * @function
   * @param {Object} event - The event object representing the input field change.
   */
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  /**
   * Submits the form to log the user in with the entered email and password.
   *
   * @function
   * @param {Object} event - The event object representing the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    login(user.email, user.password);
  };

  return (
    <div>
      <div className="float-left h-screen w-1/2 border-r-2 border-black">
        <Tilt className="mt-80 w-full font-bold sm:text-5xl md:text-7xl lg:text-9xl">
          Log-in
        </Tilt>
      </div>
      <div className="float-left w-1/2">
        <form className="pt-60">
          <label htmlFor="email" className="p-3">
            Email
          </label>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            name="email"
            id="email"
            className="border border-black p-3"
            onChange={handleChange}
          />

          <label htmlFor="password" className="p-3">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border border-black p-3"
            onChange={handleChange}
          />

          <button className="button-still" onClick={handleSubmit}>
            Login
          </button>
        </form>
        <LogInNavbar />
      </div>
    </div>
  );
};

export default Login;
