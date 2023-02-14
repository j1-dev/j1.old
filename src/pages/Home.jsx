import React, { useEffect, useState } from "react";
import ThreadDisplay from "../components/ThreadDisplay";
import SetDisplayName from "./SetDisplayName";
import { auth, db } from "../api/firebase-config";
import { query, collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

/**
 * @component
 * Renders the home page, displaying the user's threads if they have set their display name,
 * or allowing them to set their display name if they haven't already.
 *
 * @function
 * @name Home
 *
 * @return {JSX.Element} JSX element representing the Home component.
 *
 * @requires React from react
 * @requires useEffect from react
 * @requires useState from react
 * @requires ThreadDisplay from ../components/ThreadDisplay
 * @requires SetDisplayName from ./SetDisplayName
 * @requires auth from ../api/firebase-config
 * @requires db from ../api/firebase-config
 * @requires query from firebase/firestore
 * @requires collection from firebase/firestore
 * @requires doc from firebase/firestore
 * @requires useCollection from react-firebase-hooks/firestore
 * @requires useDocument from react-firebase-hooks/firestore
 */

const Home = ({}) => {
  const currentUser = auth.currentUser;
  const followsRef = collection(db, `Users/${currentUser.uid}/Follows`);
  const queryFollows = query(followsRef);
  const userRef = doc(db, "Users", currentUser.uid);
  const [value, loading] = useCollection(queryFollows);
  const [value2, loading2] = useDocument(userRef);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!loading && !loading2) {
      const users = value.docs;
      users.push(value2);
      setUsers(users);
    }
  }, [value, value2]);

  return (
    <div>
      {/* Si el usuario actual no tiene nombre de usuario, mostrar página para actualizar nombre 
          de usuario. Si no, mostrar el componente ThreadDisplay con prop users */}
      {currentUser.displayName == null ? (
        <SetDisplayName />
      ) : (
        <div>
          {!!users && (
            <div>
              <ThreadDisplay users={users} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
