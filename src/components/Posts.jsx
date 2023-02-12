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
  startAt,
  startAfter,
} from "firebase/firestore";
import Post from "./Post";
import { useEffect } from "react";
import { useState } from "react";

/**
 * This post renders all of the Posts of the Posts collection. It first loads the first 5 posts and when it scrolls to the
 * bottom, it loads the next 5.
 *
 * @todo Pagination might be improvable if you use a new query starting from the last post loaded on the handleMore()
 * function instead of adding +5 to the post limit
 *
 * @param {String} path path of the posts that are going to be rendered
 * @param {String} className tailwind classes that will apply to this component
 * @returns
 */
const Posts = ({ path, className }) => {
  // Reference to the collection that has been passed through the path prop
  const CommentCollectionRef = collection(db, path);
  // State variables
  const [posts, setPosts] = useState([]);
  const [limite, setLimite] = useState(5);
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [start, setStart] = useState(null);

  /**
   * This useEffect fetches "limite" posts and sets the starting for the next batch of posts to the last post currently
   * loaded.
   */
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
        setStart(snapshot.docs[4]);
        setPosts(data);
        setLoading(false);
      });
    };

    return unsub();
  }, [limite]);

  /**
   * Increases the limit + 5 when it is called
   */
  const handleLoadMore = () => {
    setLoading(true);
    setLimite(limite + 5);
    // const q = query(
    //   CommentCollectionRef,
    //   orderBy("createdAt", "desc"),
    //   limit(limite),
    //   startAfter(start)
    // );
    // onSnapshot(q, (snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   setStart(snapshot.docs[4]);
    //   setPosts((posts) => (posts = [...posts, ...data]));
    //   setLoading(false);
    // });
    setAtBottom(false);
  };

  /**
   * Checks when the user has scrolled to the bottom of the feed and calls the handleLoadMoreFuncion when it does
   *
   * @returns {boolean} true/false
   */
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

  /**
   * This useEffect adds/removes a scroll event listener and attaches it to the handleScroll() function
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts]);

  /**
   * This useEffect changes atBottom back to false when atBottom is true and loading is false, which means
   * that the user has reached the bottom and the next batch of posts has been loaded
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
