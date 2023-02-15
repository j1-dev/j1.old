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
  /**
   * The state variable that stores an array of posts fetched from the backend.
   * @type {Array}
   */
  const [posts, setPosts] = useState([]);

  /**
   * The state variable that stores the number of posts to be fetched from the backend.
   * @type {number}
   */
  const [limite, setLimite] = useState(5);

  /**
   * The state variable that stores a boolean flag to indicate whether posts are currently being loaded.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * The state variable that stores a boolean flag to indicate whether the user has scrolled to the bottom of the page.
   * @type {boolean}
   */
  const [atBottom, setAtBottom] = useState(false);

  /**
   * Hook that fetches posts from the Firestore database when the component is mounted or when the "limite" state changes.
   *
   * @function
   * @returns {function} A cleanup function to remove the Firestore listener.
   */
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

  /**
   * Handles loading more posts when the "load more" button is clicked.
   * Increases the limit for the number of posts to be shown by 5, sets loading state to true and sets atBottom to false.
   *
   * @callback
   * @returns {void}
   */
  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setLimite(limite + 5);
    setAtBottom(false);
  }, [limite]);

  /**
   * Registers a scroll event listener on the window object to detect when the user
   * has scrolled to the bottom of the page, triggering the `handleLoadMore` callback
   * function to load additional posts.
   *
   * @callback
   * @returns {void}
   */
  const handleScroll = useCallback(() => {
    if (loading || atBottom) return;

    // Check if the user has scrolled to the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      console.log("Scrolled to bottom!");
      setAtBottom(true);
      handleLoadMore();
    }
  }, [loading, atBottom, handleLoadMore]);

  /**
   * Registers a scroll event listener on the window object and removes it when the
   * component unmounts.
   *
   * @callback
   * @returns {void}
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, handleScroll]);

  /**
   * Clears the "atBottom" state if it's set to true and the component is not loading.
   *
   * @function
   * @returns {void}
   */
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
