import React from "react";
import Button from "./Button";

const LogInNavbar = () => {
  return (
    <nav
      className=" z-50 mx-0 list-none  overflow-hidden
                      bg-white pt-96 transition-all"
    >
      <div className="inline-flex">
        <Button path="/Login">Login</Button>
        <Button path="/Register">Register</Button>
      </div>
    </nav>
  );
};

export default LogInNavbar;
