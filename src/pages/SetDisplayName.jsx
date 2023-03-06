import { updateProfile } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../api/firebase-config";
import { Tilt } from "../api/TiltApi";
import UserServices from "../api/user.services";
import { toast } from "react-toastify";

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
  const nameRef = useRef();

  /**
   * Navigation hook
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * Updates the user state with the current user's data
   * @function
   * @todo no need to use a collection query, just use getDoc or userService.getUser
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

  const checkUserNameAvailable = async (userName) => {
    const userNameRef = doc(db, "displaynames", userName);
    let value;
    await getDoc(userNameRef).then((snapshot) => {
      const snapshotDocument = snapshot._document;
      // console.log(snapshotDocument !== null);
      if (snapshotDocument !== null) {
        value = false;
      } else {
        value = true;
      }
    });
    // console.log(value);
    return value;
  };

  /**
   * Event handler for changing the display name
   * @function
   * @param {Object} e - Event object
   */
  const handleNameChange = async (e) => {
    e.preventDefault();
    const un = nameRef.current.value;
    let check;
    await checkUserNameAvailable(un).then((res) => {
      check = res;
    });
    if (check === true) {
      updateProfile(currentUser, { displayName: nameRef.current.value }).then(
        async () => {
          const newUser = {
            ...user,
            displayName: nameRef.current.value,
            userName: nameRef.current.value,
          };
          const newUserName = {
            uid: currentUser.displayName,
            prevDisplayName: "",
            lastChange: serverTimestamp(),
          };
          const userNameRef = doc(db, "displaynames", nameRef.current.value);
          await setDoc(userNameRef, newUserName);
          await UserServices.updateUser(currentUser.uid, newUser).then(
            navigate("/")
          );
          console.log("displayName updated");

          nameRef.current.value = "";
        }
      );
    } else {
      // console.log("display name not available");
      toast.error("Display name not available");
    }
  };

  return (
    <div>
      {currentUser.user !== null ? (
        <div>
          <Tilt className="my-28 py-14 text-8xl font-semibold">
            Elija Nombre de Usuario
          </Tilt>
          <input
            ref={nameRef}
            maxLength="8"
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
