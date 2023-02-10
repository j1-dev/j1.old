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
  };

  return (
    <div className="post-feed text-center">
      {posts.map((doc) => {
        return (
          <Post data={doc} path={path} key={doc.id} className={className} />
        );
      })}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Posts;
