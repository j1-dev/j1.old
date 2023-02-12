import React from "react";

import { Tilt } from "../api/TiltApi";

/**
 * @deprecated
 * old header from 4 months ago when I started this shit
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
