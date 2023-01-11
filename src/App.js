import "./App.css";
import { useEffect, useState } from "react";
import { db, auth } from "./database.config";
import {
  addDoc,
  doc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function App() {
  return (
    <div className="App">
      <p>Hello App</p>
    </div>
  );
}
