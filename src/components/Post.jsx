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
 * This component renders a single post and handles likes and dislikes
 *
 * @param {Object} data Post data
 * @param {String} path Post path
 * @param {String} clasName Post tailwind css
 * @returns
 */
const Post = ({ data, path, className }) => {
  // Current logged in user
  const user = auth.currentUser;
  // Query to the Users collection to retrieve aditional info about the user who posted this post
  const q = query(UserCollectionRef, where("uid", "==", data.uid));
  // This hook fetches the query info
  const [value, loading] = useCollection(q);
  // Refs, querys, and fecth hooks that handle the likes, dislikes, and comments
  const likesRef = collection(db, `${path}/${data.id}/Likes`);
  const dislikesRef = collection(db, `${path}/${data.id}/Dislikes`);
  const commentsRef = collection(db, `${path}/${data.id}/Posts`);
  const queryLikes = useMemo(() => query(likesRef), [path, data.id]);
  const queryDislikes = useMemo(() => query(dislikesRef), [path, data.id]);
  const queryComments = useMemo(() => query(commentsRef), [path, data.id]);
  const [likes, loading2] = useCollection(queryLikes);
  const [dislikes, loading3] = useCollection(queryDislikes);
  const [comments, loading4] = useCollection(queryComments);
  // State variables to check if a Post is likeable/dislikeable or not
  const [likeable, setLikeable] = useState(true);
  const [dislikeable, setDislikeable] = useState(true);

  /**
   * This useEffect checks if the currently logged in user has liked the post or not
   */
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

  /**
   * This useEffect checks if the currently logged in user has disliked the post or not
   */
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

  /**
   * Use the useCallback hook to memoize the handleLike and handleDislike functions
   * so that they don't have to be re-created every time the component re-renders
   */
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

  /**
   * Use the useCallback hook to memoize the handleLike and handleDislike functions
   * so that they don't have to be re-created every time the component re-renders
   */
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

  /**
   * Converts secconds from epoch to a timestamp
   *
   * @param {Number} secs seconds since epoch when the post was posted
   * @returns {timestamp}
   */
  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  /**
   * Checks wether the url is a youtube link or not
   *
   * @param {String} url
   * @returns {boolean}
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
