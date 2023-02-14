import { db } from "../api/firebase-config";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Post from "./Post";
import React, { useEffect, useState, useCallback } from "react";

/**
 * @component
 * A component that displays a list of all Posts
 *
 * @name Posts
 * @function
 *
 * @param {Object} props - The props object for the Posts component.
 * @param {string} props.path - The path to the Firebase collection of posts.
 * @param {string} props.className - The CSS class name for the component.
 *
 * @return {JSX.Element} A React component that displays a list of posts.
 *
 * @requires db from "../api/firebase-config"
 * @requires collection from "firebase/firestore"
 * @requires orderBy from "firebase/firestore"
 * @requires query from "firebase/firestore"
 * @requires onSnapshot from "firebase/firestore"
 * @requires limit from "firebase/firestore"
 * @requires Post from "./Post"
 * @requires React from react
 */

const Posts = ({ path, className }) => {
  const [posts, setPosts] = useState([]);
  const [limite, setLimite] = useState(5);
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const CommentCollectionRef = collection(db, path);
    const unsub = () => {
      const q = query(
        CommentCollectionRef,
        orderBy("createdAt", "desc"),
        limit(limite)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(data);
        setLoading(false);
      });
    };

    return unsub();
  }, [limite, path]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setLimite(limite + 5);
    setAtBottom(false);
  }, [limite]);

  const handleScroll = useCallback(() => {
    if (loading || atBottom) return;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      console.log("Scrolled to bottom!");
      setAtBottom(true);
      handleLoadMore();
    }
  }, [loading, atBottom, handleLoadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, handleScroll]);

  useEffect(() => {
    if (!loading && atBottom) {
      setAtBottom(false);
    }
  }, [loading, atBottom]);

  return (
    <div className="post-feed text-center">
      {posts.map((doc) => {
        return (
          <Post data={doc} path={path} key={doc.id} className={className} />
        );
      })}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Posts;
