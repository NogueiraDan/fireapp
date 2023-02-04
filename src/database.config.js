import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "learning-4c6d7.firebaseapp.com",
  projectId: "learning-4c6d7",
  storageBucket: "learning-4c6d7.appspot.com",
  messagingSenderId: "575871063087",
  appId: "1:575871063087:web:83b471a4b4bddd742122da",
  measurementId: "G-1JPPXKRW3Z"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };