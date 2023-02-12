import { db } from "./firebase-config";

import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

/**
 * User collection interface
 */
export const UserCollectionRef = collection(db, "Users");

class UserService {
  addUser = async (uid, newUser) => {
    const user = doc(UserCollectionRef, uid);
    return await setDoc(user, newUser);
  };

  updateUser = (id, updatedUser) => {
    const UserDoc = doc(db, "Users", id);
    return updateDoc(UserDoc, updatedUser);
  };

  deleteUser = (id) => {
    const UserDoc = doc(db, "Users", id);
    return deleteDoc(UserDoc);
  };

  getAllUsers = () => {
    return getDocs(UserCollectionRef);
  };

  getUser = async (uid) => {
    const UserDoc = doc(UserCollectionRef, uid);
    return await getDoc(UserDoc);
  };
}

export default new UserService();
