import React, { useState } from "react";
import { push as Menu } from "react-burger-menu";
import { useSwipeable } from "react-swipeable";
import { NavLink } from "react-router-dom";
import { auth } from "../api/firebase-config";

import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
  HiOutlineCog,
} from "react-icons/hi";

const MenuS = ({ pageWrapId, outerContainerId }) => {
  const [isOpen, setOpen] = useState(null);
  const user = auth.currentUser;

  const handlers = useSwipeable({
    trackMouse: true,
    onSwipedRight: () => {
      setOpen(true);
      console.log(isOpen);
    },
  });

  return (
    <div>
      {!!user && user.displayName != null ? (
        <div>
          <div
            {...handlers}
            className="fixed bottom-0 z-50 float-left h-[92%] w-[10%] "
          />
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default MenuS;
