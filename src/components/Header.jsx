import React from "react";
import { Tilt } from "../api/TiltApi";

/**
 * @component
 * React component for rendering the header of the website.
 *
 * @function
 * @name Header
 *
 * @returns {JSX.Element} The rendered React element representing the header.
 *
 * @requires react
 * @requires ../api/TiltApi
 */

const Header = () => {
  return (
    <div className="py-28 font-cg">
      <Tilt className="sm:mx-mx mx-20 px-20 text-center sm:px-px">
        <h1 className="relative py-0 sm:text-6xl md:text-7xl lg:text-8xl">
          Hello world, I'm J1
        </h1>
      </Tilt>
    </div>
  );
};

export default Header;
