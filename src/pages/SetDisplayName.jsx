import React, { useRef, useState, useEffect } from "react";
import { auth } from "../api/firebase-config";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserServices from "../api/user.services";
import { query, where, collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { Tilt } from "../api/TiltApi";

const SetDisplayName = () => {
  const [user, setUser] = useState(null);

  const currentUser = auth.currentUser;
  const refName = useRef();
  const navigate = useNavigate();

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
          <button onClick={handleNameChange} className="button">
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
