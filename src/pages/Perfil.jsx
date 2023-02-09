import React, { useEffect, useState } from "react";
import SetDisplayName from "./SetDisplayName";
import { auth } from "../api/firebase-config";
import {
  query,
  where,
  collectionGroup,
  collection,
  orderBy,
  onSnapshot,
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
        where("uid", "==", user.uid)
      );
      onSnapshot(refQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return setPosts(data);
      });
    };
    if (ready === false) return;

    return unsub();
  }, [ready, user]);

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
