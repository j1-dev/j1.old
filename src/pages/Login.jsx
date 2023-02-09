import React, { useState } from "react";
import { useAuth } from "../api/authContext";
import LogInNavbar from "../components/LogInNavbar";
import { Tilt } from "../api/TiltApi";

/**
 * Componente Login
 *
 * @returns Página de Login
 */
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

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

          <button className="button" onClick={handleSubmit}>
            Login
          </button>
        </form>
        <LogInNavbar />
      </div>
    </div>
  );
};

export default Login;
