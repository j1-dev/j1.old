import React, { useState } from "react";
import { useAuth } from "../api/authContext";
import LogInNavbar from "../components/LogInNavbar";
import { Tilt } from "../api/TiltApi";

/**
 * @component
 * Renders a registration form where the user can sign up by providing their email and password.
 * Uses the `useAuth` hook to handle the signup process.
 *
 * @function
 * @name Register
 *
 * @return {JSX.Element} JSX element representing the Register component.
 *
 * @requires React from react
 * @requires useState from react
 * @requires useAuth from ../api/authContext
 * @requires LogInNavbar from ../components/LogInNavbar
 * @requires Tilt from ../api/TiltApi
 */

const Register = () => {
  /**
   * The current user state.
   * @type {object}
   */
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  /**
   * The authentication hook for signing up.
   * @type {object}
   * @property {function} signup - The function for signing up.
   */
  const { signup } = useAuth();

  /**
   * Updates the user state when input values change.
   *
   * @function
   * @param {Object} event - The input change event.
   * @returns {void}
   */
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  /**
   * Submits the user sign-up form.
   *
   * @function
   * @async
   * @param {Object} event - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(user.email, user.password);
  };

  return (
    <div>
      <div className="float-right h-screen w-1/2 border-l-2 border-black">
        <Tilt className="mt-80 w-full text-9xl font-bold">Register</Tilt>
      </div>
      <div className="float-right w-1/2">
        <form className="pt-60">
          <label htmlFor="email" className="p-3">
            Email
          </label>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            name="email"
            id="email"
            className="border p-3"
            onChange={handleChange}
          />

          <label htmlFor="password" className="p-3">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            name="password"
            id="password"
            className="border p-3"
            onChange={handleChange}
          />

          <button className="button" onClick={handleSubmit}>
            Register
          </button>
          <LogInNavbar />
        </form>
      </div>
    </div>
  );
};

export default Register;
