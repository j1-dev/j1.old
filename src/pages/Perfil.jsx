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
 * Componente Perfil
 *
 * @returns Tarjeta de usuario y todos los posts y comentarios publicados por
 * el usuario
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

  /**
   * UseEffect que utiliza el nombre de usuario (encontrado en la
   * ruta y extraido por useParams()). Cuando se actualiza username, se
   * ejecuta unsub, que escucha los cambios de onSnapshot, que devuelve el
   * documento de la colección Users cuyo nickname es el obtenido por la ruta.
   * (((necesita limpieza)))
   *
   * @requires username
   */
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

  /**
   * UseEffect que recupera todos los posts y comentarios publicados por el
   * usuario conectado. Los posts se guardan en [posts] con la función de
   * estado setPosts()
   *
   * @requires {ready, user}
   */
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

  /**
   * Increases the limit + 5 when it is called
   */
  const handleLoadMore = useCallback(() => {
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
  }, [limite]);

  /**
   * Checks when the user has scrolled to the bottom of the feed and calls the handleLoadMoreFuncion when it does
   *
   * @returns {boolean} true/false
   */
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

  /**
   * This useEffect adds/removes a scroll event listener and attaches it to the handleScroll() function
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, atBottom, loading, handleScroll]);

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
