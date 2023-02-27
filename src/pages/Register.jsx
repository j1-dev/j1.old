import React, { useState } from "react";
import { useAuth } from "../api/authContext";
import LogInNavbar from "../components/LogInNavbar";
import { Tilt } from "../api/TiltApi";
import banner from "../banner.gif";

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
    <div className="px-14 md:p-0">
      <div className="float-right hidden h-screen w-1/2 border-l-2 border-black md:block">
        <Tilt className="mt-80 w-full text-9xl font-bold">Register</Tilt>
      </div>
      <img
        src={banner}
        alt="yes"
        className="z-50 block w-full -translate-y-24 md:hidden"
      />
      <div className=" float-right w-full md:w-1/2">
        <form className="md:pt-64">
          <label htmlFor="email" className="p-3 text-2xl">
            Email
          </label>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            name="email"
            id="email"
            className="w-full border-b-2 border-black p-3 md:w-auto"
            onChange={handleChange}
          />

          <label htmlFor="password" className=" p-3 text-2xl">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            name="password"
            id="password"
            className="w-full border-b-2 border-black p-3 md:w-auto"
            onChange={handleChange}
          />

          <button className="button-still" onClick={handleSubmit}>
            Register
          </button>
          <LogInNavbar />
        </form>
      </div>
    </div>
  );
};

export default Register;
