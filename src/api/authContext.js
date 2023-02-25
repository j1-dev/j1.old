import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase-config";
import { useNavigate } from "react-router-dom";
import UserService from "./user.services";

export const authContext = createContext();

export const useAuth = () => {
  const cont = useContext(authContext);
  if (!cont) throw new Error("tiene que tener contexto puto");
  return cont;
};

/**
 * This element passes information down the DOM about the state of the user
 *
 * @param {any} children
 */
export function AuthProvider({ children }) {
  const defaultProfilePicUrl =
    "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a";
  // user State variable that will be passed down the current user that's logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Hook that sets the user to the user that has logged/signed in
   *
   * @function
   * @return {function} - clean up function for the onAuthStateChanged listener
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /**
   * This function takes an email and a password and creates a new
   * user with email and passwordand also adds it to the firestore
   * database. After that, the login function is called
   *
   * @todo Add error and success indicators such as green/red cards
   * with an exclamation icon or something idk
   *
   * @function
   * @param {String} email
   * @param {String} password
   */
  const signup = async (email, password) => {
    const ts = Date.now() / 1000;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        userCredential.user.photoURL = defaultProfilePicUrl;
        const user = userCredential.user;
        console.log(user.email, " signed up");
        const newUser = {
          uid: user.uid,
          displayName: user.displayName,
          userName: user.displayName,
          prevDisplayName: null,
          prevUserName: null,
          lastDisplayNameChange: null,
          lastUserNameChange: null,
          joined: ts,
          email: user.email,
          bio: "",
          badge: null,
          verified: user.emailVerified,
          photo: defaultProfilePicUrl,
          likesCounter: 0,
          dislikesCounter: 0,
          followersCounter: 0,
          followsCounter: 0,
        };
        //add new user to user collection in firestore
        console.log("new user = ", newUser);
        console.log("user uid = ", user.uid);
        await UserService.addUser(user.uid, newUser);
        login(email, password);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  /**
   * This function takes an email and a password and calls the signInWithEmailAndPassword
   * with them and then it navigates to /Home
   *
   * @todo Add error and success indicators such as green/red cards
   * with an exclamation icon or something idk
   *
   * @function
   * @param {String} email
   * @param {String} password
   */
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email, " logged in");
        navigate("/Home");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <authContext.Provider value={{ signup, login, user, loading }}>
      {children}
    </authContext.Provider>
  );
}
