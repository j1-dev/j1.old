import {
  collection,
  query,
  setDoc,
  where,
  doc,
  deleteDoc,
  getDoc,
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

const Post = ({ data, path, className }) => {
  const user = auth.currentUser;

  const q = query(UserCollectionRef, where("uid", "==", data.uid));
  const [value, loading] = useCollection(q);

  const likesRef = collection(db, `${path}/${data.id}/Likes`);
  const dislikesRef = collection(db, `${path}/${data.id}/Dislikes`);
  const commentsRef = collection(db, `${path}/${data.id}/Posts`);
  const queryLikes = useMemo(() => query(likesRef), [path, data.id]);
  const queryDislikes = useMemo(() => query(dislikesRef), [path, data.id]);
  const queryComments = useMemo(() => query(commentsRef), [path, data.id]);
  const [likes, loading2] = useCollection(queryLikes);
  const [dislikes, loading3] = useCollection(queryDislikes);
  const [comments, loading4] = useCollection(queryComments);

  const [likeable, setLikeable] = useState(true);
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

  // Use the useCallback hook to memoize the handleLike and handleDislike functions
  // so that they don't have to be re-created every time the component re-renders
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
      <Link to={`/Post/${data.id}`}>
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

        {matchYoutubeUrl(data.post) ? (
          <YouTube videoId={matchYoutubeUrl(data.post)} />
        ) : (
          <p className="mb-3 font-inter text-lg">{data.post}</p>
        )}
        {data.photoURL && (
          <img
            className="border-gray m-auto my-3 w-8/12 rounded-3xl"
            src={data.photoURL}
            loading="lazy"
          ></img>
        )}

        <hr className="-z-50 mt-4 border" />

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
