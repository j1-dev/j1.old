import React, { useEffect, useState, useCallback } from "react";
import SetDisplayName from "./SetDisplayName";
import { auth } from "../api/firebase-config";
import {
  query,
  where,
  collectionGroup,
  collection,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../api/firebase-config";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { useParams } from "react-router-dom";

/**
 * @component
 * Renders the user profile page, displaying the user's posts and user information.
 *
 * @function
 * @name Perfil
 *
 * @return {JSX.Element} JSX element representing the Perfil component.
 *
 * @requires React from react
 * @requires SetDisplayName from ./SetDisplayName
 * @requires auth from ../api/firebase-config
 * @requires query from firebase/firestore
 * @requires where from firebase/firestore
 * @requires collectionGroup from firebase/firestore
 * @requires collection from firebase/firestore
 * @requires orderBy from firebase/firestore
 * @requires onSnapshot from firebase/firestore
 * @requires limit from firebase/firestore
 * @requires db from ../api/firebase-config
 * @requires Post from ../components/Post
 * @requires UserCard from ../components/UserCard
 * @requires useParams from react-router-dom
 */

const Perfil = () => {
  /**
   * The username extracted from the URL parameters
   * @type {string}
   */
  const { username } = useParams();

  /**
   * The currently authenticated user object
   * @type {firebase.User|null}
   */
  const currentUser = auth.currentUser;

  /**
   * The array of posts to display
   * @type {Array<Object>|null}
   */
  const [posts, setPosts] = useState(null);

  /**
   * The user object whose profile is being displayed
   * @type {Object|null}
   */
  const [user, setUser] = useState(null);

  /**
   * The maximum number of posts to display at once
   * @type {number}
   */
  const [limite] = useState(5);

  /**
   * Whether the posts are currently being loaded
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Whether the user has scrolled to the bottom of the page
   * @type {boolean}
   */
  const [atBottom, setAtBottom] = useState(false);

  /**
   * Whether the component is ready to render
   * @type {boolean}
   */
  const [ready, setReady] = useState(false);

  /**
   * The state variable that stores the last loaded post for cursor based pagination
   * @type {DocumentSnapshot}
   */
  const [cursor, setCursor] = useState(null);

  /**
   * Sets the user state variable to the user with a given nickname.
   * @function
   * @param {string} username - The user's nickname to search for.
   * @returns {function} - Unsubscribes the listener for the username.
   */
  useEffect(() => {
    const unsub = () => {
      const ref = collection(db, "users");
      const refQuery = query(ref, where("displayName", "==", username));

      onSnapshot(refQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        data.map((doc) => {
          return setUser(doc);
        });
        return setReady(true);
      });
    };
    return unsub();
  }, [username]);

  /**
   * Sets the posts state variable to a list of posts from the user, in descending order of creation time.
   * @function
   * @returns {function} - Unsubscribes the listener for the user's posts.
   */
  useEffect(() => {
    const unsub = () => {
      const ref = collectionGroup(db, "posts");
      const refQuery = query(
        ref,
        orderBy("createdAt", "desc"),
        where("uid", "==", user.uid),
        limit(limite)
      );
      onSnapshot(refQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCursor(snapshot.docs[4]);
        setPosts(data);
        setLoading(false);
      });
    };
    if (ready === false) return;

    return unsub();
  }, [ready, user, limite]);

  /**
   * Increments the limit of posts to fetch and sets loading to true.
   *
   * @function
   * @returns {void}
   */
  const handleLoadMore = useCallback(() => {
    setLoading(true);
    const CommentCollectionRef = collection(db, "posts");
    const unsub = () => {
      const q = query(
        CommentCollectionRef,
        orderBy("createdAt", "desc"),
        where("uid", "==", user.uid),
        limit(limite),
        startAfter(cursor)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCursor(snapshot.docs[4]);
        setPosts((p) => p.concat(data));
        setLoading(false);
      });
    };
    unsub();
    setAtBottom(false);
  }, [limite, cursor]);

  /**
   * Event handler for scrolling the page, checks whether the user has scrolled to the bottom
   * of the page and calls handleLoadMore() if true.
   *
   * @function
   * @returns {void}
   */
  const handleScroll = useCallback(() => {
    if (loading || atBottom) return;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      console.log("Scrolled to bottom!");
      setAtBottom(true);
      if (!loading) handleLoadMore();
    }
  }, [loading, atBottom, handleLoadMore]);

  /**
   * Adds an event listener for scrolling the page and removes the listener when the component unmounts.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, atBottom, loading, handleScroll]);

  /**
   * Sets atBottom state variable to false when loading is false and atBottom is true.
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
    <div>
      {/* Si el usuario actual no tiene nombre de usuario, mostrar página para actualizar nombre 
          de usuario. Si no, mostrar todos los posts guardados en la variable de estado posts */}
      {currentUser.displayName == null ? (
        <SetDisplayName />
      ) : (
        <div>
          {!ready && "loading"}
          {ready && <UserCard user={user} />}

          {posts?.map((doc) => {
            return (
              <Post
                data={doc}
                path={"posts"}
                key={doc.id}
                className="panel-post mx-auto sm:w-11/12 md:w-2/3 lg:w-1/3"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Perfil;
