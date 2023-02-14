import React, { useEffect, useState } from "react";
import { auth, db } from "../api/firebase-config";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  deleteDoc,
  query,
} from "firebase/firestore";
import { Avatar } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";

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
  const currentUser = auth.currentUser;
  const [followeable, setFolloweable] = useState(true);

  const followersRef = collection(db, `Users/${user.uid}/Followers`);
  const followsRef = collection(db, `Users/${user.uid}/Follows`);
  const queryFollowers = query(followersRef);
  const queryFollows = query(followsRef);
  const [value, loading] = useCollection(queryFollowers);
  const [value2, loading2] = useCollection(queryFollows);

  const handleFollow = async (e) => {
    e.preventDefault();

    setFolloweable(false);

    if (followeable) {
      const followerRef = collection(db, `Users/${user.uid}/Followers`);
      const userRef = doc(followerRef, currentUser.uid);
      const newFollower = {
        nickName: currentUser.displayName,
        uid: currentUser.uid,
      };

      await setDoc(userRef, newFollower);

      const followRef = collection(db, `Users/${currentUser.uid}/Follows`);
      const userFollowRef = doc(followRef, user.uid);
      const newFollow = {
        nickName: user.nickName,
        uid: user.uid,
      };

      await setDoc(userFollowRef, newFollow);
    } else {
      return console.log("You are already a follower");
    }
  };

  const handleUnfollow = async (e) => {
    e.preventDefault();

    setFolloweable(true);

    if (!followeable) {
      const followerRef = collection(db, `Users/${user.uid}/Followers`);
      const userRef = doc(followerRef, currentUser.uid);

      await deleteDoc(userRef);

      const followRef = collection(db, `Users/${currentUser.uid}/Follows`);
      const userFollowRef = doc(followRef, user.uid);

      await deleteDoc(userFollowRef);
    } else {
      return console.log("You are already a follower");
    }
  };

  useEffect(() => {
    const unsub = async () => {
      const usersRef = collection(db, `Users/${user.uid}/Followers`);
      const userRef = doc(usersRef, currentUser.uid);
      const userSnap = await getDoc(userRef);
      console.log(userSnap.data());
      if (typeof userSnap.data() !== "undefined") {
        console.log("no seguible");
        return setFolloweable(false);
      } else {
        console.log("seguible");
        return setFolloweable(true);
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
        <div className="font-bold">@{user.nickName}</div>
      </div>

      {currentUser.uid !== user.uid ? (
        followeable ? (
          <button className="user-panel-button text-lg" onClick={handleFollow}>
            Follow
          </button>
        ) : (
          <button
            className="user-panel-button text-lg"
            onClick={handleUnfollow}
          >
            Unfollow
          </button>
        )
      ) : (
        <></>
      )}

      <div className="user-panel-followers">
        {!loading && <div>{value.size} Followers</div>}
        {!loading2 && <div>{value2.size} Follows</div>}
      </div>
    </div>
  );
};

export default UserCard;
