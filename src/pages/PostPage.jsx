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
  const [data, setData] = useState(null);
  const [pathComments, setPathComments] = useState(null);
  const [pathPost, setPathPost] = useState(null);
  const [segments, setSegments] = useState([]);
  const [parentPath, setParentPath] = useState([]);
  const [parentId, setParentId] = useState([]);
  const [parentData, setParentData] = useState(null);
  const ref = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    setParentData([]);
    setPathComments(null);
    const postRef = collectionGroup(db, "Posts");
    const queryPost = query(postRef, where("id", "==", id));
    onSnapshot(queryPost, (snapshot) => {
      snapshot.docs.map((doc) => {
        setData(doc);
        let newPath = "/";
        let commentPath = "/";
        let newSegments = [];

        doc.ref._path.segments.map((segment) => {
          return newSegments.push(segment);
        });
        newSegments.splice(0, 5);

        newSegments.map((segment) => {
          return (commentPath += segment + "/");
        });
        commentPath += "Posts";
        console.log(commentPath);
        setPathComments(commentPath);

        newSegments.pop();
        setSegments(newSegments);
        newSegments.map((segment) => {
          return (newPath += segment + "/");
        });

        newPath = newPath.substring(0, newPath.length - 1);
        return setPathPost(newPath);
      });
    });
  }, [id]);

  useEffect(() => {
    let newSegments = segments;
    newSegments.pop();
    nearestParent(newSegments);
  }, [segments]);

  useEffect(() => {
    const parentPosts = [];
    parentPath.map((path, index) => {
      const parentRef = doc(db, path, parentId[index]);
      return onSnapshot(parentRef, (doc) => {
        parentPosts.unshift(doc);
        return setParentData(parentPosts);
      });
    });
    if (parentPosts.length > 0) {
      setParentData(parentPosts);
    }
  }, [parentPath, parentId]);

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

  const getComments = () => {
    return <Posts path={pathComments} className="panel-post" />;
  };

  return (
    <div>
      {data && pathComments && (
        <div>
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
