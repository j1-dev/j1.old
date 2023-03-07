import React, { useEffect, useState } from "react";
import { auth, db } from "../api/firebase-config";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  deleteDoc,
  query,
  getCountFromServer,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Avatar } from "@mui/material";

/**
 * @component
 * Renders a UserCard component that displays user information and allows following/unfollowing.
 *
 * @function
 * @name UserCard
 *
 * @param {Object} props - The props object.
 * @param {Object} props.user - The user object.
 * @param {string} props.user.uid - The user ID.
 * @param {string} props.user.nickName - The user nickname.
 * @param {string} props.user.photo - The user photo URL.
 *
 * @return {JSX.Element} JSX element representing the UserCard component.
 *
 * @requires React from react
 * @requires useEffect from react
 * @requires useState from react
 * @requires auth from ../api/firebase-config
 * @requires db from ../api/firebase-config
 * @requires setDoc from firebase/firestore
 * @requires doc from firebase/firestore
 * @requires getDoc from firebase/firestore
 * @requires collection from firebase/firestore
 * @requires deleteDoc from firebase/firestore
 * @requires query from firebase/firestore
 * @requires useCollection from react-firebase-hooks/firestore
 * @requires Avatar from @mui/material
 */

const UserCard = ({ user }) => {
  /**
   * The current logged in user.
   * @type {Object}
   */
  const currentUser = auth.currentUser;

  const u = doc(db, "users", user.uid);

  /**
   * Boolean state to determine whether the current user can be followed.
   * @type {Boolean}
   */
  const [followeable, setFolloweable] = useState(true);

  /**
   * Firestore reference to the current user's followers collection.
   * @type {Object}
   */
  const followersRef = collection(db, `users/${user.uid}/followers`);

  /**
   * Firestore reference to the current user's follows collection.
   * @type {Object}
   */
  const followsRef = collection(db, `users/${user.uid}/follows`);

  /**
   * A Firestore query to retrieve the current user's followers.
   * @type {Object}
   */
  const queryFollowers = query(followersRef);

  /**
   * A Firestore query to retrieve the users that the current user follows.
   * @type {Object}
   */
  const queryFollows = query(followsRef);

  /**
   * Follows counter
   * @type {Integer}
   */
  const [follows, setFollows] = useState(0);

  /**
   * Followers counter
   * @type {Integer}
   */
  const [followers, setFollowers] = useState(0);

  /**
   * A useEffect hook that fetches follows and followers counters
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const unsub = async () => {
      setFollows(await getCountFromServer(queryFollows));
      setFollowers(await getCountFromServer(queryFollowers));
    };

    unsub();
  }, [queryFollows, queryFollowers]);

  /**
   * Handles the action of following a user, updating both the current user's followers collection and the target user's follows collection.
   * @function
   * @async
   * @param {Event} e - The event object that triggered the function.
   * @returns {void}
   */
  const handleFollow = async (e) => {
    e.preventDefault();

    setFolloweable(false); // disable the follow button

    // If the user is followeable, i.e. not already following them
    if (followeable) {
      const followerRef = collection(db, `users/${user.uid}/followers`);
      const userRef = doc(followerRef, currentUser.uid);
      const newFollower = {
        displayName: currentUser.displayName,
        uid: currentUser.uid,
      };

      await setDoc(userRef, newFollower); // add the current user to the target user's followers collection

      const followRef = collection(db, `users/${currentUser.uid}/follows`);
      const userFollowRef = doc(followRef, user.uid);
      const newFollow = {
        displayName: user.displayName,
        uid: user.uid,
      };

      const time = Date.now() / 1000;

      const notificationRef = collection(db, `users/${user.uid}/notifications`);
      const followNotificationRef = doc(notificationRef, currentUser.uid);
      const newNotification = {
        id: currentUser.uid,
        from: currentUser.uid,
        to: user.uid,
        message: "Alguien te ha seguido!",
        sentAt: time,
        type: "follow",
      };

      await setDoc(userFollowRef, newFollow); // add the target user to the current user's follows collection
      await setDoc(followNotificationRef, newNotification);
      await updateDoc(u, {
        score: increment(+3),
      });
    } else {
      return console.log("You are already a follower"); // if the user is already following them, log a message and do nothing
    }
  };

  /**
   * Handles the action of unfollowing a user, removing the current user from both the target user's followers collection and the current user's follows collection.
   * @function
   * @async
   * @param {Event} e - The event object that triggered the function.
   * @returns {void}
   */
  const handleUnfollow = async (e) => {
    e.preventDefault();

    setFolloweable(true); // enable the follow button

    // If the user is not followeable, i.e. already following them
    if (!followeable) {
      const followerRef = collection(db, `users/${user.uid}/followers`);
      const userRef = doc(followerRef, currentUser.uid);

      await deleteDoc(userRef); // remove the current user from the target user's followers collection

      const followRef = collection(db, `users/${currentUser.uid}/follows`);
      const userFollowRef = doc(followRef, user.uid);

      const notificationRef = collection(db, `users/${user.uid}/notifications`);
      const followNotificationRef = doc(notificationRef, user.uid);

      await deleteDoc(userFollowRef); // remove the target user from the current user's follows collection
      await deleteDoc(followNotificationRef);
      await updateDoc(u, {
        score: increment(-3),
      });
    } else {
      return console.log("You are not following this user"); // if the user is not following them, log a message and do nothing
    }
  };

  /**
   * Checks whether the current user is following the target user and updates the followeable state accordingly.
   * @function
   * @async
   * @returns {void}
   */
  useEffect(() => {
    const unsub = async () => {
      const usersRef = collection(db, `users/${user.uid}/followers`);
      const userRef = doc(usersRef, currentUser.uid);
      const userSnap = await getDoc(userRef);
      console.log(userSnap.data());

      // If the current user is already following the target user, set followeable to false
      if (typeof userSnap.data() !== "undefined") {
        console.log("not followeable");
        return setFolloweable(false);
      } else {
        console.log("followeable");
        return setFolloweable(true); // Otherwise, set followeable to true
      }
    };

    unsub();
  }, []);

  return (
    <div className="user-panel">
      <div className="user-panel-top"></div>
      <Avatar
        className="user-panel-avatar"
        alt="lol"
        src={user.photo}
        sx={{ height: 100, width: 100 }}
      />
      <div className="user-panel-data">
        <div className="font-bold">~{user.displayName}</div>
      </div>

      {currentUser.uid !== user.uid ? (
        followeable ? (
          <button className="user-panel-button text-xl" onClick={handleFollow}>
            Follow
          </button>
        ) : (
          <button
            className="user-panel-button text-xl"
            onClick={handleUnfollow}
          >
            Unfollow
          </button>
        )
      ) : (
        <></>
      )}

      <div className="user-panel-followers">
        {followers && <div>{followers.data().count} Followers</div>}
        {follows && <div>{follows.data().count} Follows</div>}
      </div>
    </div>
  );
};

export default UserCard;
