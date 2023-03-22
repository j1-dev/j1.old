import { auth, db } from "../api/firebase-config";
// import {
//   collection,
//   orderBy,
//   query,
//   onSnapshot,
//   limit,
//   startAfter,
// } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import Notification from "./Notification";

let collection, orderBy, query, onSnapshot, limit, startAfter;

(async () => {
  const firestoreModule = await import("firebase/firestore");
  collection = firestoreModule.collection;
  orderBy = firestoreModule.orderBy;
  query = firestoreModule.query;
  onSnapshot = firestoreModule.onSnapshot;
  limit = firestoreModule.limit;
  startAfter = firestoreModule.startAfter;
})();

function Notifications() {
  const user = auth.currentUser;
  /**
   * The state variable that stores an array of notifications fetched from the backend.
   * @type {Array}
   */
  const [notifications, setNotifications] = useState([]);

  /**
   * The state variable that stores the number of notifications to be fetched from the backend.
   * @type {number}
   */
  const [limite] = useState(7);

  /**
   * The state variable that stores a boolean flag to indicate whether notifications are currently being loaded.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * The state variable that stores a boolean flag to indicate whether the user has scrolled to the bottom of the page.
   * @type {boolean}
   */
  const [atBottom, setAtBottom] = useState(false);

  /**
   * The state variable that stores the last loaded post for cursor based pagination
   * @type {DocumentSnapshot}
   */
  const [cursor, setCursor] = useState(null);

  /**
   * Hook that fetches posts from the Firestore database when the component is mounted.
   * Sets cursor to the last post loaded for proper cursor pagination
   *
   * @function
   * @returns {function} A cleanup function to remove the Firestore listener.
   */
  useEffect(() => {
    const NotificationCollectionRef = collection(
      db,
      `users/${user.uid}/notifications`
    );
    const unsub = () => {
      const q = query(
        NotificationCollectionRef,
        orderBy("sentAt", "desc"),
        limit(limite)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCursor(snapshot.docs[6]);
        setNotifications(data);
        setLoading(false);
      });
    };

    unsub();
  }, [limite]);

  /**
   * Handles loading more posts when the "load more" button is clicked.
   * Calls a onSnapshot listener for the next 5 posts after the cursor.
   *
   * @callback
   * @returns {void}
   */
  const handleLoadMore = useCallback(() => {
    setLoading(true);
    const NotificationCollectionRef = collection(
      db,
      `users/${user.uid}/notifications`
    );
    const unsub = () => {
      const q = query(
        NotificationCollectionRef,
        orderBy("sentAt", "desc"),
        limit(limite),
        startAfter(cursor)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCursor(snapshot.docs[6]);
        setNotifications((p) => p.concat(data));
        setLoading(false);
      });
    };
    unsub();
    setAtBottom(false);
  }, [limite, cursor]);

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
      if (!loading) handleLoadMore();
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
  }, [handleScroll]);

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
    <div className="notification-feed text-center">
      {notifications.map((doc) => {
        return <Notification data={doc} key={doc.id} />;
      })}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Notifications;
