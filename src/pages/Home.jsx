import React, { useEffect, useState, useContext } from "react";
import ThreadDisplay from "../components/ThreadDisplay";
import SetDisplayName from "./SetDisplayName";
import { auth, db } from "../api/firebase-config";
import { query, collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { authContext } from "../api/authContext";
/**
 * Componente Home.
 *
 * @returns componente SetDisplayName o ThreadDisplay
 */
const Home = ({}) => {
  const { user, userPlus } = useContext(authContext);
  const currentUser = auth.currentUser; //Usuario conectado actualmente
  const followsRef = collection(db, `Users/${currentUser.uid}/Follows`); //Referencia a la colección de los usuarios seguidos por currentUser
  const queryFollows = query(followsRef); //Query de la referencia followsRef
  const userRef = doc(db, "Users", currentUser.uid); //Referencia a el documento usuario conectado actualmente
  const [value, loading] = useCollection(queryFollows); //Fetch de los documentos pedidos por queryFollows
  const [value2, loading2] = useDocument(userRef); //Fetch del documento userRef
  const [users, setUsers] = useState(null); //Variable de estado donde se guardarán los usuarios seguido
  //se le pasará al componente ThreadDisplay que se encargará de mostrar                                                                                //todos los posts de los usuarios seguidos y el propio usuario
  /*                                                                            //todos los posts de los usuarios seguidos
    Hook que se ejecuta cada vez que se actualiza la colección de usuarios
    seguidos o el usuario.
    Añade el usuario actual a la colección de usuarios seguidos para que 
    se muestren también los posts del usuario actual 
  */
  useEffect(() => {
    if (!loading && !loading2) {
      console.log(userPlus);
      const users = value.docs;
      users.push(value2);
      setUsers(users);
    }
  }, [value, value2]);

  return (
    <div>
      {/* Si el usuario actual no tiene nombre de usuario, mostrar página para actualizar nombre 
          de usuario. Si no, mostrar el componente ThreadDisplay con prop users */}
      {currentUser.displayName == null ? (
        <SetDisplayName />
      ) : (
        <div>
          {!!users && (
            <div>
              <ThreadDisplay users={users} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
