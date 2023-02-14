import {
  collection,
  query,
  setDoc,
  where,
  doc,
  deleteDoc,
  getDoc,
  // updateDoc,
} from "firebase/firestore";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { auth, db } from "../api/firebase-config";
import { UserCollectionRef } from "../api/user.services";
import { useCollection } from "react-firebase-hooks/firestore";
import { NavLink, Link } from "react-router-dom";
import YouTube from "react-youtube";
import { GoThumbsdown, GoThumbsup } from "react-icons/go";
import { TbMessage } from "react-icons/tb";
import { Avatar } from "@mui/material";

/**
 * @component
 * A component that displays a single post, along with information about its author and comments, likes, and dislikes.
 *
 * @function
 * @name Post
 *
 * @param {object} props - The props for the Post component.
 * @param {object} props.data - An object containing information about the post, such as its content, author, and creation time.
 * @param {string} props.path - The path to the post in the Firebase database.
 * @param {string} props.className - The class name(s) to apply to the root element of the component.
 * @returns {JSX.Element} - The rendered Post component.
 *
 * @requires collection from firebase/firestore
 * @requires query from firebase/firestore
 * @requires setDoc from firebase/firestore
 * @requires where from firebase/firestore
 * @requires doc from firebase/firestore
 * @requires deleteDoc from firebase/firestore
 * @requires getDoc from firebase/firestore
 * @requires React from react
 * @requires useState from react
 * @requires useMemo from react
 * @requires useEffect from react
 * @requires useCallback from react
 * @requires auth from ../api/firebase-config
 * @requires db from ../api/firebase-config
 * @requires UserCollectionRef from ../api/user.services
 * @requires useCollection from react-firebase-hooks/firestore
 * @requires NavLink from react-router-dom
 * @requires Link from react-router-dom
 * @requires YouTube from react-youtube
 * @requires GoThumbsdown from react-icons/go
 * @requires GoThumbsup from react-icons/go
 * @requires TbMessage from react-icons/tb
 * @requires Avatar from @mui/material.
 */

const Post = ({ data, path, className }) => {
  /**
   * The current user object obtained from Firebase Auth
   * @type {Object}
   */
  const user = auth.currentUser;

  /**
   * A Firestore query object used to retrieve the user with matching uid
   * @type {Object}
   */
  const q = query(UserCollectionRef, where("uid", "==", data.uid));

  /**
   * A collection object used to perform CRUD operations on the Likes subcollection
   * @type {Object}
   */
  const likesRef = collection(db, `${path}/${data.id}/Likes`);

  /**
   * A collection object used to perform CRUD operations on the Dislikes subcollection
   * @type {Object}
   */
  const dislikesRef = collection(db, `${path}/${data.id}/Dislikes`);

  /**
   * A collection object used to perform CRUD operations on the Posts subcollection
   * @type {Object}
   */
  const commentsRef = collection(db, `${path}/${data.id}/Posts`);

  /**
   * A Firestore query object used to retrieve the Likes subcollection
   * @type {Object}
   */
  const queryLikes = useMemo(() => query(likesRef), [path, data.id]);

  /**
   * A Firestore query object used to retrieve the Dislikes subcollection
   * @type {Object}
   */
  const queryDislikes = useMemo(() => query(dislikesRef), [path, data.id]);

  /**
   * A Firestore query object used to retrieve the Posts subcollection
   * @type {Object}
   */
  const queryComments = useMemo(() => query(commentsRef), [path, data.id]);

  /**
   * An array of documents representing the Likes subcollection
   * @type {Array}
   */
  const [likes, loading2] = useCollection(queryLikes);

  /**
   * An array of documents representing the Dislikes subcollection
   * @type {Array}
   */
  const [dislikes, loading3] = useCollection(queryDislikes);

  /**
   * An array of documents representing the Posts subcollection
   * @type {Array}
   */
  const [comments, loading4] = useCollection(queryComments);

  /**
   * A state variable that determines if the post can be liked
   * @type {boolean}
   */
  const [likeable, setLikeable] = useState(true);

  /**
   * A state variable that determines if the post can be disliked
   * @type {boolean}
   */
  const [dislikeable, setDislikeable] = useState(true);

  useEffect(() => {
    const unsub = async () => {
      const likeRef = doc(likesRef, user.uid);
      const likeSnap = await getDoc(likeRef);
      if (typeof likeSnap.data() !== "undefined") {
        return setLikeable(false);
      } else {
        return setLikeable(true);
      }
    };

    unsub();
  }, [path]);

  useEffect(() => {
    const unsub = async () => {
      const dislikeRef = doc(dislikesRef, user.uid);
      const dislikeSnap = await getDoc(dislikeRef);
      if (typeof dislikeSnap.data() !== "undefined") {
        return setDislikeable(false);
      } else {
        return setDislikeable(true);
      }
    };

    unsub();
  }, [path]);

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();

      const likeRef = doc(likesRef, user.uid);
      const newUser = {
        uid: user.uid,
      };

      if (likeable) {
        setDislikeable(true);
        setLikeable(false);
        await setDoc(likeRef, newUser);
        await deleteDoc(doc(dislikesRef, user.uid));
      } else {
        setLikeable(true);
        await deleteDoc(likeRef);
      }
    },
    [likeable, dislikesRef, likesRef, user.uid]
  );

  const handleDislike = useCallback(
    async (e) => {
      e.preventDefault();

      const dislikeRef = doc(dislikesRef, user.uid);
      const newUser = {
        uid: user.uid,
      };

      if (dislikeable) {
        setLikeable(true);
        setDislikeable(false);
        await setDoc(dislikeRef, newUser);
        await deleteDoc(doc(likesRef, user.uid));
      } else {
        setDislikeable(true);
        await deleteDoc(dislikeRef);
      }
    },
    [dislikeable, likesRef, dislikesRef, user.uid]
  );

  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  function matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  }

  return (
    <div className={className} key={data.id}>
      {/* 
        This Link wraps around the entire post so that when it is clicked, it navigates the user to the Post page
        that shows the other Posts that this post is a response to and also shows responses to this post.
      */}
      <Link to={`/Post/${data.id}`}>
        {/* 
          This post renders information about the user that has posted this post, like the avatar, the display name and 
          also the time when this post was posted
          @todo Instead of the time, show number of minutes/hours/days since the time of the post.
        */}
        <div className="mb-10 w-full pb-7">
          {loading && ""}
          {value?.docs.map((doc) => {
            const path = `/${doc.data().nickName}`;
            const date = toDateTime(data.createdAt.seconds);
            return (
              <div className="float-left w-11/12">
                <p className="text-base">
                  <Avatar
                    alt={doc.data().nickName}
                    src={doc.data().photo}
                    className="float-left mr-3"
                  />
                  <NavLink to={path} className="underline hover:no-underline">
                    {doc.data().nickName}
                  </NavLink>
                </p>
                <div className="text-xs ">
                  Posted at: {date.toLocaleString("es-EU")}
                </div>
              </div>
            );
          })}
        </div>

        {/* 
          If the post is a youtube url. If it is it renders the embeded youtube video. If not, it renders the post body
          (data.post) in a <p>
        */}
        {matchYoutubeUrl(data.post) ? (
          <YouTube videoId={matchYoutubeUrl(data.post)} />
        ) : (
          <p className="mb-3 font-inter text-lg">{data.post}</p>
        )}
        {/* 
          If the post has a photo attached, it renders it
        */}
        {data.photoURL && (
          <img
            className="border-gray m-auto my-3 w-8/12 rounded-3xl"
            src={data.photoURL}
            loading="lazy"
          ></img>
        )}

        {/* Separator */}
        <hr className="-z-50 mt-4 border" />

        {/* 
          This div contains the like/dislike/comments button/counters
        */}
        <div className="float-left w-full pt-5 pl-3 text-base">
          <button className="float-left w-1/6" onClick={handleLike}>
            {!loading2 && (
              <div className="pt-2">
                <GoThumbsup
                  className={`${
                    likeable ? "text-black" : "text-green-600"
                  } absolute z-10 scale-150`}
                />
                {likes && likes.size}
              </div>
            )}
          </button>
          <button className="float-left w-1/6" onClick={handleDislike}>
            {!loading3 && (
              <div className="pt-2">
                <GoThumbsdown
                  className={`${
                    dislikeable ? "text-black" : "text-red-600"
                  } absolute z-10 scale-150`}
                />
                {dislikes && dislikes.size}
              </div>
            )}
          </button>
          <button className="float-left w-1/6">
            {!loading4 && (
              <div className="pt-2">
                <TbMessage className="absolute z-10 scale-150" />
                {comments && comments.size}
              </div>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Post;
