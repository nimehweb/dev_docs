// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0TVmowg3AyCEpv_tjtvx3qMFC3Jdpw5s",
  authDomain: "devdocsbackend.firebaseapp.com",
  projectId: "devdocsbackend",
  storageBucket: "devdocsbackend.firebasestorage.app",
  messagingSenderId: "86926502936",
  appId: "1:86926502936:web:386b5b5bb0ac8c6f0ea76d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
        authProvider: "local"
      });
    }
    catch(error){
        console.error(error);
    }
}

const loginWithEmailAndPassword = async (email, password) => {
  try{
     await signInWithEmailAndPassword(auth, email, password)
  }
  catch(error){
      console.error(error);
  }
}

const logout =  async () => {
  await signOut(auth);
}

export { auth,db, registerWithEmailAndPassword, loginWithEmailAndPassword, logout };
export default app;