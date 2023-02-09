import { db } from "../api/firebase-config";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Post from "./Post";
import { useEffect } from "react";
import { useState } from "react";

const Posts = ({ path, className }) => {
  const CommentCollectionRef = collection(db, path);
  const q = query(
    CommentCollectionRef,
    orderBy("createdAt", "desc")
    //limit(10)
  );

  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const unsub = () => {
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(data);
      });
    };

    return unsub();
  }, []);

  return (
    <div className="post-feed text-center">
      {posts?.map((doc) => {
        return (
          <Post data={doc} path={path} key={doc.id} className={className} />
        );
      })}
    </div>
  );
};

export default Posts;
