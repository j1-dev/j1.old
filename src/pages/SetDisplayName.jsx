import React, { useRef, useState, useEffect } from "react";
import { auth } from "../api/firebase-config";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserServices from "../api/user.services";
import { query, where, collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { Tilt } from "../api/TiltApi";

/**
 * @component
 * Renders a form for the user to set their display name if they have not already done so.
 *
 * @function
 * @name SetDisplayName
 *
 * @return {JSX.Element} JSX element representing the SetDisplayName component.
 *
 * @requires React from react
 * @requires useRef from react
 * @requires useState from react
 * @requires useEffect from react
 * @requires auth from ../api/firebase-config
 * @requires updateProfile from firebase/auth
 * @requires useNavigate from react-router-dom
 * @requires UserServices from ../api/user.services
 * @requires query from firebase/firestore
 * @requires where from firebase/firestore
 * @requires collection from firebase/firestore
 * @requires onSnapshot from firebase/firestore
 * @requires db from ../api/firebase-config
 * @requires Tilt from ../api/TiltApi
 */

const SetDisplayName = () => {
  /**
   * User state
   * @type {object}
   */
  const [user, setUser] = useState(null);

  /**
   * Currently logged in user
   * @type {object}
   */
  const currentUser = auth.currentUser;

  /**
   * Reference for the display name input element
   * @type {object}
   */
  const refName = useRef();

  /**
   * Navigation hook
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * Updates the user state with the current user's data
   * @function
   * @param {object} currentUser - Current user object
   * @returns {function} unsub - cleanup function for the onSnapshot listener
   */
  useEffect(() => {
    const unsub = () => {
      const ref = collection(db, "Users");
      const refQuery = query(ref, where("uid", "==", currentUser.uid));

      onSnapshot(refQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        data.map((doc) => {
          return setUser(doc);
        });
      });
    };

    return () => {
      unsub();
    };
  }, [currentUser]);

  /**
   * Event handler for changing the display name
   * @function
   * @param {Object} e - Event object
   */
  const handleNameChange = (e) => {
    e.preventDefault();
    navigate(0);
    updateProfile(currentUser, { displayName: refName.current.value }).then(
      async () => {
        const newUser = {
          ...user,
          nickName: refName.current.value,
        };
        await UserServices.updateUser(currentUser.uid, newUser);
        console.log("displayName updated");

        refName.current.value = "";
        navigate("/");
      }
    );
  };

  return (
    <div>
      {currentUser.user !== null ? (
        <div>
          <Tilt className="my-28 py-14 text-8xl font-semibold">
            Elija Nombre de Usuario
          </Tilt>
          <input
            ref={refName}
            maxLength="10"
            className="border-b-2 border-black text-4xl outline-none"
          ></input>
          <button onClick={handleNameChange} className="button-still">
            submit
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SetDisplayName;
