import * as firebase from "firebase/app";
// import firebase from './firebase';
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { GoogleAuthProvider,getAuth, setPersistence,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,signOut, browserLocalPersistence} from "firebase/auth";
import { getFirestore,query,getDocs,collection,where,addDoc} from "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAhy0mPIoXEzqPALwn5CRacH74uHosfrKY",
  authDomain: "dashboard-97116.firebaseapp.com",
  projectId: "dashboard-97116",
  storageBucket: "dashboard-97116.appspot.com",
  messagingSenderId: "1079821563344",
  appId: "1:1079821563344:web:666d145f2f13226a8575d5",
  measurementId: "G-RZENEDYG4J"
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseConfig);
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };
  
  
  const auth = getAuth();
  (async () => {
    await setPersistence(auth, browserLocalPersistence);
  })();
  
  
  export {
    app,
    auth,
    db,
    firebaseConfig,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
  };
