import React, { useState, useEffect } from "react";
import { push as Menu } from "react-burger-menu";
import { NavLink } from "react-router-dom";
import { auth } from "../api/firebase-config";
import { useAuth } from "../api/authContext";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
  HiOutlineCog,
} from "react-icons/hi";

/**
 * @component
 * React component for rendering a sidebar menu using react-burger-menu and react-swipeable.

 * @function
 * @deprecated
 * @name MenuS

 * @param {string} pageWrapId - The ID of the page wrap element.
 * @param {string} outerContainerId - The ID of the outer container element.
 * @returns {JSX.Element} The rendered React element representing the sidebar menu.

 * @requires react
 * @requires react-burger-menu
 * @requires react-swipeable
 * @requires react-router-dom
 * @requires ../api/firebase-config
 * @requires react-icons/hi
 * @requires useAuth from ../api/authContext
 */

const MenuS = ({ open, pageWrapId, outerContainerId }) => {
  /**
   * A hook from a custom `useAuth` hook that provides loading status for authentication data.
   *
   * @type {boolean}
   */
  const { loading } = useAuth();

  /**
   * Represents the state of whether a component is open or closed.
   *
   * @type {boolean|null}
   */
  const [isOpen, setOpen] = useState(open);

  /**
   * Represents the current authenticated user.
   *
   * @type {firebase.User|null}
   */
  const user = auth.currentUser;

  useEffect(() => {
    setOpen(open);
  }, [open]);

  if (loading) return null;

  return (
    <div>
      {!!user && user.displayName !== null ? (
        <div>
          <Menu
            isOpen={isOpen}
            onStateChange={(s) => setOpen(s.isOpen)}
            pageWrapId={pageWrapId}
            outerContainerId={outerContainerId}
            className=" overflow-visible bg-white shadow-lg"
            burgerButtonClassName={"hidden"}
            bodyClassName={"overflow-visible"}
            htmlClassName={"overflow-visible"}
          >
            <ul className="navbar left-5 top-60 w-[250px]">
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Home">
                  <HiOutlineHome className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Home</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to={"/" + user.displayName}>
                  <HiOutlineUserCircle className="float-left text-3xl " />
                  <p className="pl-5 text-3xl font-normal">Perfil</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Shop">
                  <HiOutlineShoppingCart className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Tienda</p>
                </NavLink>
              </li>
              <li
                onClick={() => setOpen(false)}
                className="my-9 transition-colors hover:text-blue-500"
              >
                <NavLink to="/Ajustes">
                  <HiOutlineCog className="float-left text-3xl" />
                  <p className="pl-5 text-3xl font-normal">Ajustes</p>
                </NavLink>
              </li>
            </ul>
          </Menu>
        </div>
      ) : null}
    </div>
  );
};

export default MenuS;
