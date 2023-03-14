import React, { useEffect, useState } from "react";
import ThreadDisplay from "../components/ThreadDisplay";
import SetDisplayName from "./SetDisplayName";
import { auth, db } from "../api/firebase-config";
// import { query, collection, doc } from "firebase/firestore";
// import { useCollection, useDocument } from "react-firebase-hooks/firestore";

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
  /**
   * The current user object.
   * @type {Object}
   */
  const currentUser = auth.currentUser;

  // /**
  //  * The collection reference to the user's follows.
  //  * @type {Object}
  //  */
  // const followsRef = collection(db, `Users/${currentUser.uid}/Follows`);

  // /**
  //  * The query for the user's follows.
  //  * @type {Array}
  //  */
  // const queryFollows = query(followsRef);

  // /**
  //  * The document reference to the current user.
  //  * @type {Object}
  //  */
  // const userRef = doc(db, "Users", currentUser.uid);

  // /**
  //  * The array of followed users from the query.
  //  * @type {Array}
  //  */
  // const [value, loading] = useCollection(queryFollows);

  // /**
  //  * The current user's document from the database.
  //  * @type {Object}
  //  */
  // const [value2, loading2] = useDocument(userRef);

  // /**
  //  * The list of users.
  //  * @type {Array}
  //  */
  // const [users, setUsers] = useState(null);

  // /**
  //  * useEffect to set the state of users array.
  //  * When the value and value2 change, if they are not loading, the array is set with the documents obtained.
  //  *
  //  * @function
  //  * @returns {void}
  //  */
  // useEffect(() => {
  //   if (!loading && !loading2) {
  //     const users = value.docs;
  //     users.push(value2);
  //     setUsers(users);
  //   }
  // }, [value, value2]);

  return (
    <div>
      {currentUser.displayName == null ? (
        <SetDisplayName />
      ) : (
        <div>
          <div>
            <ThreadDisplay />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
