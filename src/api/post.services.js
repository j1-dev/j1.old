import { db } from "./firebase-config";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

/**
 * Post collection interface
 */
export const PostCollectionRef = collection(db, "Posts");

class PostService {
  addPosts = (newPost) => {
    return addDoc(PostCollectionRef, newPost);
  };

  setPosts = (ref, newPost) => {
    return setDoc(ref, newPost);
  };

  updatePost = (id, updatedPost) => {
    const PostDoc = doc(db, "Posts", id);
    return updateDoc(PostDoc, updatedPost);
  };

  deletePost = (id) => {
    const PostDoc = doc(db, "Posts", id);
    return deleteDoc(PostDoc);
  };

  getAllPosts = () => {
    return getDocs(PostCollectionRef);
  };

  getPost = (id) => {
    const PostDoc = doc(db, "Posts", id);
    return getDoc(PostDoc);
  };
}

export default new PostService();
