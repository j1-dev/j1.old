// import { db } from "../api/firebase-config";
// import {
//   collection,
//   orderBy,
//   query,
//   onSnapshot,
//   limit,
// } from "firebase/firestore";
// import Post from "./Post";
// import { useEffect } from "react";
// import { useState } from "react";

// const Posts = ({ path, className }) => {
//   const CommentCollectionRef = collection(db, path);
//   const q = query(
//     CommentCollectionRef,
//     orderBy("createdAt", "desc")
//     //limit(10)
//   );

//   const [posts, setPosts] = useState(null);

//   useEffect(() => {
//     const unsub = () => {
//       onSnapshot(q, (snapshot) => {
//         const data = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));
//         setPosts(data);
//       });
//     };

//     return unsub();
//   }, []);

//   return (
//     <div className="post-feed text-center">
//       {posts?.map((doc) => {
//         return (
//           <Post data={doc} path={path} key={doc.id} className={className} />
//         );
//       })}
//     </div>
//   );
// };

// export default Posts;

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
  const [posts, setPosts] = useState([]);
  const [limite, setLimite] = useState(5);
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
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
  }, [limite]);

  const handleLoadMore = () => {
    setLoading(true);
    setLimite(limite + 5);
    setAtBottom(false);
  };

  const handleScroll = () => {
    if (loading || atBottom) return;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      console.log("Scrolled to bottom!");
      setAtBottom(true);
      handleLoadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts]);

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
