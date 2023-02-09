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

const PostPage = () => {
  const [data, setData] = useState(null); //Datos del post actual
  const [pathComments, setPathComments] = useState(null); //Path de la colección de los comentarios del post actual
  const [pathPost, setPathPost] = useState(null); //Path de la colección donde se encuentra el post actual
  const [segments, setSegments] = useState([]); //Array de segmentos del path
  const [parentPath, setParentPath] = useState([]); //Array de path de posts antecesores a data
  const [parentId, setParentId] = useState([]); //Array de ids de posts antecesores a data
  const [parentData, setParentData] = useState(null); //Array de datos de posts antecesores a data
  const ref = useRef(null);
  const { id } = useParams(); //id del post actual

  /*** TAREA ***
   *
   * (1) Mostrar todos los posts anidados anteriores: done
   * (2) Añadir caja de comentarios (SendBox): done
   * (3) Mostrar todos los comentarios al post actual: done
   * (4) Cambiar className de los padres y los commentarios
   * (5) Averiguar como hacer scroll automáticamente
   *
   */

  /**
   * useEffect para recoger el post cuya id se conoce gracias a useParams().
   * Se ejecutará cada vez que cambie id.
   */
  useEffect(() => {
    //La única manera de conseguir un post solo con el id es con colectionGroup buscando todos los posts
    //donde la id es la id conseguida por useParams()
    setParentData([]);
    setPathComments(null);
    const postRef = collectionGroup(db, "Posts");
    const queryPost = query(postRef, where("id", "==", id));
    onSnapshot(queryPost, (snapshot) => {
      snapshot.docs.map((doc) => {
        setData(doc); //{doc} -> snapshot del documento que queremos recuperar
        let newPath = "/"; //newPath almacenará el path que le pasaremos al elemento Post
        let commentPath = "/"; //commentPath almacenará el path que le pasaremos a SendBox para que almacene el comentario en el lugar correcto
        let newSegments = []; //newSegments almacenará los segmentos del path

        //el path del snapshot está almacenado en path, pero _path contiene los segmentos del path, que
        //serán necesarios para ir consiguiendo los documentos "padre"
        doc.ref._path.segments.map((segment) => {
          newSegments.push(segment);
        });
        newSegments.splice(0, 5); //Los 5 primeros segmentos son del proyecto y han de ser eliminados

        newSegments.map((segment) => {
          commentPath += segment + "/";
        });
        commentPath += "Posts";
        console.log(commentPath);
        setPathComments(commentPath);

        newSegments.pop(); //El último elemento se quita porque es la id del post actual y no es necesaria
        setSegments(newSegments);
        newSegments.map((segment) => {
          newPath += segment + "/";
        });

        newPath = newPath.substring(0, newPath.length - 1); //Eliminar "/" sobrante
        setPathPost(newPath);
      });
    });
  }, [id]);

  /**
   * useEffect para recuperar los posts padres del post actual.
   * Se ejecutará cada vez que cambie segments.
   */
  useEffect(() => {
    let newSegments = segments;
    newSegments.pop();
    nearestParent(newSegments);
  }, [segments]);

  useEffect(() => {
    const parentPosts = [];
    parentPath.map((path, index) => {
      const parentRef = doc(db, path, parentId[index]);
      onSnapshot(parentRef, (doc) => {
        parentPosts.unshift(doc);
        setParentData(parentPosts);
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
        path += segments + "/";
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
