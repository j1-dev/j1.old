import React, { useState, useEffect } from "react";
import Post from "./Post";
import Posts from "./Posts";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase-config";
import SendBox from "./SendBox";

const ThreadDisplay = ({ users }) => {
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [feedType, setFeedType] = useState(0);

  useEffect(() => {
    const unsub = () => {
      setPosts([]);
      const ref = collection(db, "Posts");
      const refQuery = query(
        ref,
        where(
          "uid",
          "in",
          users.map((user) => user.data().uid)
        )
      );
      onSnapshot(refQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts((p) => p.concat(data));
      });
    };

    return unsub();
  }, []);

  useEffect(() => {
    const postArray = [
      ...new Map(posts.map((item) => [item["id"], item])).values(),
    ];
    postArray.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    setFeed(postArray);
  }, [posts]);

  const handleFeedSelect = (e) => {
    e.preventDefault();
    setFeedType(e.target.value);
    console.log(e.target.value);
  };

  const renderFeed = () => {
    switch (feedType) {
      case 0:
        return <Posts path="Posts" className="panel-post" />;
      case 1:
        return (
          <div>
            {feed?.map((post) => {
              return (
                <Post
                  data={post}
                  path="Posts"
                  key={post.id}
                  className="panel-post"
                />
              );
            })}
          </div>
        );
      case 2:
        return <div className="pt-10 ">todavía no está esto hecho, perdón</div>;
    }
  };

  return (
    <div>
      <div className="w-screen">
        <SendBox className="post-input z-10 -translate-x-1.5" path="Posts" />
      </div>

      {renderFeed()}
    </div>
  );
};

export default ThreadDisplay;
