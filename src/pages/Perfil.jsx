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
  const { username } = useParams();
  const currentUser = auth.currentUser;
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [limite, setLimite] = useState(5);
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = () => {
      const ref = collection(db, "Users");
      const refQuery = query(ref, where("nickName", "==", username));

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

  useEffect(() => {
    const unsub = () => {
      const ref = collectionGroup(db, "Posts");
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
        setPosts(data);
        setLoading(false);
      });
    };
    if (ready === false) return;

    return unsub();
  }, [ready, user, limite]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setLimite(limite + 5);
    setAtBottom(false);
  }, [limite]);

  const handleScroll = useCallback(() => {
    if (loading || atBottom) return;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      console.log("Scrolled to bottom!");
      setAtBottom(true);
      handleLoadMore();
    }
  }, [loading, atBottom, handleLoadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, atBottom, loading, handleScroll]);

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
                path={"Posts"}
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
