import React, { useState, useEffect } from "react";
import Post from "./Post";
import Posts from "./Posts";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "../api/firebase-config";
import SendBox from "./SendBox";

/**
 * @component
 * Renders a ThreadDisplay component that displays a feed of Posts and a SendBox to input and send messages.
 *
 * @function
 * @name ThreadDisplay
 *
 * @param {Object} props - The props object.
 * @param {Array} props.users - An array of user objects.
 *
 * @return {JSX.Element} JSX element representing the ThreadDisplay component.
 *
 * @requires React from react
 * @requires useState from react
 * @requires useEffect from react
 * @requires Post from ./Post
 * @requires Posts from ./Posts
 * @requires collection from firebase/firestore
 * @requires query from firebase/firestore
 * @requires where from firebase/firestore
 * @requires onSnapshot from firebase/firestore
 * @requires db from ../api/firebase-config
 * @requires SendBox from ./SendBox
 *
 * @todo Right now it shows all of the posts but in the future it will show the posts
 * of the followed users only.
 */

const ThreadDisplay = ({ users }) => {
  /**
   * An array of post objects.
   * @type {Array}
   */
  // const [posts, setPosts] = useState([]);

  /**
   * An array of post objects representing the current feed.
   * @type {Array}
   */
  // const [feed, setFeed] = useState([]);

  /**
   * An integer representing the current feed type.
   * @type {number}
   */
  // const [feedType, setFeedType] = useState(0);

  /**
   * Sets up a subscription to the 'Posts' collection in the database and updates the 'posts' state with the results.
   *
   * @function
   * @returns {function} A function to unsubscribe from the snapshot listener.
   */
  // useEffect(() => {
  //   /**
  //    * Resets the 'posts' state to an empty array, then sets up a query to retrieve posts authored by users in 'users' state.
  //    * Updates the 'posts' state with the results of the query.
  //    */
  //   const unsub = () => {
  //     setPosts([]);
  //     const ref = collection(db, "Posts");
  //     const refQuery = query(
  //       ref,
  //       where(
  //         "uid",
  //         "in",
  //         users.map((user) => user.data().uid)
  //       )
  //     );
  //     onSnapshot(refQuery, (snapshot) => {
  //       const data = snapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }));
  //       setPosts((p) => p.concat(data));
  //     });
  //   };

  //   // Runs the 'unsub' function once when the component mounts to set up the snapshot listener.
  //   // An empty dependency array means that the effect only runs once.
  //   return unsub();
  // }, []);

  /**
   * Updates the 'feed' state with an array of posts sorted by their creation time,
   * and removes any duplicate posts based on their 'id' attribute.
   *
   * @function
   * @param {Array} posts An array of post objects.
   */
  // useEffect(() => {
  //   // Create a new array of posts with duplicates removed, using the 'id' attribute as the key.
  //   const postArray = [
  //     ...new Map(posts.map((item) => [item["id"], item])).values(),
  //   ];

  //   // Sort the array of posts by their creation time in descending order.
  //   postArray.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  //   // Update the 'feed' state with the sorted array of posts.
  //   setFeed(postArray);
  // }, [posts]);

  /**
   * Handles the user's selection of a new 'feed type'.
   *
   * @function
   * @param {Event} e The event object for the feed select form element.
   */
  // const handleFeedSelect = (e) => {
  //   e.preventDefault();

  //   // Update the 'feedType' state with the selected value from the feed select form.
  //   setFeedType(e.target.value);

  //   // Log the selected value to the console.
  //   console.log(e.target.value);
  // };

  /**
   * Renders the appropriate feed based on the selected 'feedType' state.
   *
   * @function
   * @returns {JSX.Element} The appropriate feed component based on the selected 'feedType' state.
   */
  // const renderFeed = () => {
  //   switch (feedType) {
  //     case 0:
  //       // Render the 'Posts' component, passing in a path and class name.
  //       return <Posts path="Posts" className="panel-post" />;
  //     case 1:
  //       // Render a list of posts based on the 'feed' state, passing in the post data, path, and class name for each post.
  //       return (
  //         <div>
  //           {feed?.map((post) => {
  //             return (
  //               <Post
  //                 data={post}
  //                 path="Posts"
  //                 key={post.id}
  //                 className="panel-post"
  //               />
  //             );
  //           })}
  //         </div>
  //       );
  //     case 2:
  //       // Render a message indicating that this feed type has not yet been implemented.
  //       return <div className="pt-10 ">todavía no está esto hecho, perdón</div>;
  //   }
  // };

  return (
    <div>
      <div className="w-screen">
        <SendBox className="post-input z-10 -translate-x-1.5" path="Posts" />
      </div>
      <Posts path="Posts" className="panel-post" />;
    </div>
  );
};

export default ThreadDisplay;
