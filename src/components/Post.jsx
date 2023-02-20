import {
  collection,
  query,
  setDoc,
  where,
  doc,
  deleteDoc,
  getDoc,
  getCountFromServer,
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
   * An array of the user of the post and a loading state variable
   * @type {array}
   */
  const [value, loading] = useCollection(q);

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
   * A state variable that holds the number of likes
   * @type {Number}
   */
  const [likes, setLikes] = useState(0);

  /**
   * A state variable that holds the number of dislikes
   * @type {Number}
   */
  const [dislikes, setDislikes] = useState(0);

  /**
   * A state variable that holds the number of comments
   * @type {Number}
   */
  const [comments, setComments] = useState(0);

  /**
   * A state variable that updates the likes variable with +1 when a user
   * clicks the like button or -1 when a user unlikes a post
   * @type {Numer}
   */
  const [l, setL] = useState(0);

  /**
   * A state variable that updates the likes variable with +1 when a user
   * clicks the dislike button or -1 when a user undislikes a post
   * @type {Number}
   */
  const [d, setD] = useState(0);

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
      setLikes(await getCountFromServer(queryLikes));
      setDislikes(await getCountFromServer(queryDislikes));
      setComments(await getCountFromServer(queryComments));
    };

    unsub();
  }, [queryLikes, queryDislikes, queryComments]);

  /**
   * A useEffect hook that checks if the current user has already liked a specific post
   * and sets the likeable state to true or false accordingly.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const unsub = async () => {
      // Get a reference to the user's likes for the post
      const likeRef = doc(likesRef, user.uid);

      // Get the like document snapshot
      const likeSnap = await getDoc(likeRef);

      // If the user has already liked the post, set likeable to false
      if (typeof likeSnap.data() !== "undefined") {
        return setLikeable(false);
      } else {
        // If the user hasn't liked the post, set likeable to true
        return setLikeable(true);
      }
    };

    // Unsubscribe the snapshot listener
    unsub();
  }, [path]);

  /**
   * A useEffect hook that checks if the current user has already disliked a specific post
   * and sets the dislikeable state to true or false accordingly.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const unsub = async () => {
      // Get a reference to the user's dislikes for the post
      const dislikeRef = doc(dislikesRef, user.uid);

      // Get the dislike document snapshot
      const dislikeSnap = await getDoc(dislikeRef);

      // If the user has already disliked the post, set dislikeable to false
      if (typeof dislikeSnap.data() !== "undefined") {
        return setDislikeable(false);
      } else {
        // If the user hasn't disliked the post, set dislikeable to true
        return setDislikeable(true);
      }
    };

    // Unsubscribe the snapshot listener
    unsub();
  }, [path]);

  /**
   * A memoized function that handles the like button click event.
   * @callback
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event.
   * @returns {Promise<void>}
   */
  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();

      // Get a reference to the user's likes for the post
      const likeRef = doc(likesRef, user.uid);

      // Create a new user object with the user ID
      const newUser = {
        uid: user.uid,
      };

      // If the post has not been liked by the user yet
      if (likeable) {
        // Set dislikeable to true and likeable to false
        setDislikeable(true);
        setLikeable(false);

        // Set like update variable to +1
        setL(l + 1);
        // Add the user to the likes collection
        await setDoc(likeRef, newUser);

        // If the user has already disliked the post, remove the dislike and set the dislike update variable
        if (!dislikeable) {
          setD(d - 1);
          await deleteDoc(doc(dislikesRef, user.uid));
        }
      } else {
        // If the post has already been liked by the user
        // Set likeable to true and remove the user from the likes collection and set the like update variable
        setL(l - 1);
        setLikeable(true);
        await deleteDoc(likeRef);
      }
    },
    [likeable, dislikesRef, likesRef, user.uid]
  );

  /**
   * A memoized function that handles the dislike button click event.
   * @callback
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event.
   * @returns {Promise<void>}
   */
  const handleDislike = useCallback(
    async (e) => {
      e.preventDefault();

      // Get a reference to the user's dislikes for the post
      const dislikeRef = doc(dislikesRef, user.uid);

      // Create a new user object with the user ID
      const newUser = {
        uid: user.uid,
      };

      // If the post has not been disliked by the user yet
      if (dislikeable) {
        // Set likeable to true and dislikeable to false
        setLikeable(true);
        setDislikeable(false);

        // Set dislike update variable to +1
        setD(d + 1);
        // Add the user to the dislikes collection
        await setDoc(dislikeRef, newUser);

        // If the user has already liked the post, remove the like and set the like update variable
        if (!likeable) {
          setL(l - 1);
          await deleteDoc(doc(likesRef, user.uid));
        }
      } else {
        // If the post has already been disliked by the user
        // Set dislikeable to true and remove the user from the dislikes collection and set the dislike update variable
        setD(d - 1);
        setDislikeable(true);
        await deleteDoc(dislikeRef);
      }
    },
    [dislikeable, likesRef, dislikesRef, user.uid]
  );

  /**
   * Converts a Unix timestamp (in seconds) to a JavaScript Date object.
   * @function
   * @param {number} secs - The Unix timestamp to convert, in seconds.
   * @returns {Date} The corresponding Date object.
   */
  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  /**
   * Matches a YouTube video URL and extracts the video ID.
   * @function
   * @param {string} url - The URL to match.
   * @returns {string|false} The video ID if a match is found, or false otherwise.
   */
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
            {!!likes && (
              <div className="pt-2">
                <GoThumbsup
                  className={`${
                    likeable ? "text-black" : "text-green-600"
                  } absolute scale-150`}
                />
                {likes && likes.data().count + l}
              </div>
            )}
          </button>
          <button className="float-left w-1/6" onClick={handleDislike}>
            {!!dislikes && (
              <div className="pt-2">
                <GoThumbsdown
                  className={`${
                    dislikeable ? "text-black" : "text-red-600"
                  } absolute z-10 scale-150`}
                />
                {dislikes && dislikes.data().count + d}
              </div>
            )}
          </button>
          <button className="float-left w-1/6">
            {!!comments && (
              <div className="pt-2">
                <TbMessage className="absolute scale-150" />
                {comments && comments.data().count}
              </div>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Post;
