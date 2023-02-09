import React from "react";
import logo from "../logo.png";
import { auth } from "../api/firebase-config";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Topbar = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const path = window.location.pathname;

  const renderWindowTitle = (pathname) => {
    switch (pathname) {
      case "/":
      case "/Home":
        return <p className="pt-5 text-3xl font-bold">Home</p>;
      case `/${user.displayName}`:
        return <p className="pt-5 text-3xl font-bold">{user.displayName}</p>;
      case "/Shop":
        return <p className="pt-5 text-3xl font-bold">Tienda</p>;
      case "/Ajustes":
        return <p className="pt-5 text-3xl font-bold">Ajustes</p>;
      default:
        if (pathname.includes("/Post"))
          return <p className="pt-5 text-3xl font-bold">Post</p>;
        else
          return <p className="pt-5 text-3xl font-bold">{pathname.slice(1)}</p>;
    }
  };

  const renderBackButton = (pathname) => {
    if (pathname === "/Home" || pathname === "/") {
      return (
        <img
          src={user.photoURL}
          alt="."
          className="h-[75px] cursor-pointer rounded-full p-3"
        />
      );
    } else {
      return (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 text-5xl"
        >
          <FiArrowLeft />
        </button>
      );
    }
  };

  return (
    <div className="h-20 ">
      {!!user && user.displayName != null ? (
        <div className="">
          <div className="float-right w-1/3">
            <img
              src={logo}
              alt="J1"
              onClick={() => navigate("/Home")}
              className="float-right h-20 p-2"
            />
          </div>
          <div className="float-right w-1/3">{renderWindowTitle(path)}</div>
          <div className="float-left w-1/3">{renderBackButton(path)}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Topbar;
