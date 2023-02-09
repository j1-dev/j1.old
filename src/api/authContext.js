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

export function AuthProvider({ children }) {
  const defaultProfilePicUrl =
    "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signup = async (email, password) => {
    const now = new Date();
    const time = {
      seconds: Math.round(now.getTime() / 1000),
    };
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        userCredential.user.photoURL = defaultProfilePicUrl;
        const user = userCredential.user;
        console.log(user.email, " signed up");
        const newUser = {
          uid: user.uid, // uid
          photo: defaultProfilePicUrl, // imagen de perfil
          phone: user.phoneNumber, // número de teléfono
          verified: user.emailVerified, // correo verificado
          nickName: user.displayName, // nickName
          email: user.email, // email
          bio: "", // biografía
          joined: time.seconds, // hora de registro
          followers: 0, // personas que te siguen
          follows: 0, // personas a las que sigues
          likes: 0, // likes recibidos
          dislikes: 0, // dislikes recibidos
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
