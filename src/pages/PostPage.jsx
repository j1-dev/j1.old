import React, { useEffect, useState, useRef } from "react";
import Post from "../components/Post";
import Posts from "../components/Posts";
import {
  query,
  where,
  onSnapshot,
  collectionGroup,
  doc,
} from "firebase/firestore";
import { db } from "../api/firebase-config";
import { useParams } from "react-router-dom";
import SendBox from "../components/SendBox";

/**
 * @component
 * Renders a post page, including the post, its parent posts and its comments.
 *
 * @function
 * @name PostPage
 *
 * @return {JSX.Element} JSX element representing the PostPage component.
 *
 * @requires React from react
 * @requires useEffect from react
 * @requires useState from react
 * @requires useRef from react
 * @requires Post from ../components/Post
 * @requires Posts from ../components/Posts
 * @requires query from firebase/firestore
 * @requires where from firebase/firestore
 * @requires onSnapshot from firebase/firestore
 * @requires collectionGroup from firebase/firestore
 * @requires doc from firebase/firestore
 * @requires db from ../api/firebase-config
 * @requires useParams from react-router-dom
 * @requires SendBox from ../components/SendBox
 */

const PostPage = () => {
  /**
   * The state for the data to be displayed in the component.
   * @type {object | null}
   */
  const [data, setData] = useState(null);

  /**
   * The state for the path to the comments in Firestore.
   * @type {string | null}
   */
  const [pathComments, setPathComments] = useState(null);

  /**
   * The state for the path to the post in Firestore.
   * @type {string | null}
   */
  const [pathPost, setPathPost] = useState(null);

  /**
   * The state for the segments extracted from the path.
   * @type {Array<string>}
   */
  const [segments, setSegments] = useState([]);

  /**
   * The state for the parent path.
   * @type {Array<string>}
   */
  const [parentPath, setParentPath] = useState([]);

  /**
   * The state for the parent ID.
   * @type {Array<string>}
   */
  const [parentId, setParentId] = useState([]);

  /**
   * The state for the parent data.
   * @type {object | null}
   */
  const [parentData, setParentData] = useState(null);

  /**
   * A reference to the HTML element of the component.
   * @type {React.RefObject}
   */
  const ref = useRef(null);

  /**
   * The ID extracted from the URL params.
   * @type {string}
   */
  const { id } = useParams();

  /**
   * Fetches the data for the post with the given ID and updates state variables related to post and comments
   *
   * @function
   * @param {string} id - the ID of the post to fetch data for
   * @returns {void}
   */
  useEffect(() => {
    setParentData([]);
    setPathComments(null);

    // Create a reference to the collection "Posts"
    const postRef = collectionGroup(db, "posts");

    // Create a query for the post with the given ID
    const queryPost = query(postRef, where("id", "==", id));

    // Set up a snapshot listener to listen for changes to the post data
    onSnapshot(queryPost, (snapshot) => {
      // For each document in the snapshot
      snapshot.docs.map((doc) => {
        // Set the current post data
        setData(doc);

        // Set up variables for creating paths to the current post and its comments
        let newPath = "/";
        let commentPath = "/";
        let newSegments = [];

        // Get the segments of the document reference's path
        doc.ref._path.segments.map((segment) => {
          return newSegments.push(segment);
        });
        // Remove the first 5 segments, which correspond to the collection and the parent documents
        newSegments.splice(0, 5);

        // Create the path to the comments for the current post
        newSegments.map((segment) => {
          return (commentPath += segment + "/");
        });
        commentPath += "posts";

        // Update state variables with the path to the comments for the current post
        setPathComments(commentPath);

        // Remove the last segment, which corresponds to the current post
        newSegments.pop();
        // Update state variables with the path to the parent of the current post
        setSegments(newSegments);
        newSegments.map((segment) => {
          return (newPath += segment + "/");
        });

        // Remove the trailing slash from the path to the current post
        newPath = newPath.substring(0, newPath.length - 1);
        // Update state variables with the path to the current post
        return setPathPost(newPath);
      });
    });
  }, [id]);

  /**
   * Determines the nearest parent of the current post and updates state variables related to parent data
   *
   * @function
   * @param {Array<string>} segment - an array of strings representing the segments of the path to the current post
   * @returns {void}
   */
  useEffect(() => {
    let newSegments = segments;
    newSegments.pop();
    nearestParent(newSegments);
  }, [segments]);

  /**
   * Fetches the data for the nearest parent(s) of the current post and updates state variables with the parent data
   *
   * @function
   * @return {void}
   */
  useEffect(() => {
    const parentPosts = [];

    // For each path in the parent path array
    parentPath.map((path, index) => {
      // Create a reference to the parent document with the corresponding ID
      const parentRef = doc(db, path, parentId[index]);

      // Set up a snapshot listener to listen for changes to the parent data
      return onSnapshot(parentRef, (doc) => {
        // Add the parent document to the beginning of the parent posts array
        parentPosts.unshift(doc);
        // Update state variables with the parent posts array
        setParentData(parentPosts);
      });
    });
  }, [parentPath, parentId]);

  /**
   * Given a segment, retrieves its nearest parent by popping segments off the array,
   * creating an id list and a path list, and setting the values in state.
   *
   * @function
   * @param {Array} segment - The segment to retrieve its nearest parent.
   * @returns {void}
   */
  const nearestParent = (segment) => {
    let idList = [];
    let pathList = [];
    while (segment.length > 0) {
      let id = segment.pop();
      let path = "/";
      segment.map((segments) => {
        return (path += segments + "/");
      });
      path = path.substring(0, path.length - 1);
      idList.push(id);
      pathList.push(path);
      segment.pop();
    }

    setParentId(idList);
    setParentPath(pathList);
  };

  /**
   * Returns the comments for the current post by rendering the Posts component
   * with the path and a classname.
   *
   * @function
   * @returns {JSX.Element} The Posts component for the current post.
   */
  const getComments = () => {
    return <Posts path={pathComments} className="panel-post" />;
  };

  const getParents = () => {
    return (
      <div>
        {parentData.length > 0 &&
          parentData.map((post, index) => {
            return (
              <Post
                data={{ ...post.data(), id: post.id }}
                path={parentPath[parentData.length - index - 1]}
                className="panel-post "
                key={parentId[index]}
              />
            );
          })}
      </div>
    );
  };

  return (
    <div>
      {data && pathComments && (
        <div>
          <div>{parentData.length > 0 && <div>{getParents()}</div>}</div>

          <Post
            data={{ ...data.data(), id: data.id }}
            path={pathPost}
            className="panel-post"
            key={id}
          />
          <SendBox className="post-input" path={pathComments} ref={ref} />
          <div>{getComments()}</div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
