import React, { useState, useEffect } from "react";
import { db } from "../api/firebase-config";
import { auth } from "../api/firebase-config";
import { deleteField } from "firebase/firestore";

const UserCount = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const userRef = db.collection("Users");

    // Track changes to the user's online status
    auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        userRef.doc().set({ isOnline: true }, { merge: true });

        // Remove online status when user logs out
        return () =>
          userRef
            .doc(user.uid)
            .set({ isOnline: deleteField() }, { merge: true });
      }
    });

    const unsubscribe = userRef
      .where("isOnline", "==", true)
      .onSnapshot((snapshot) => {
        setUserCount(snapshot.size);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <p>Number of users currently logged in: {userCount}</p>
    </div>
  );
};

export default UserCount;
