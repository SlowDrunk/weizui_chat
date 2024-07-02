import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "weizuichat.firebaseapp.com",
  projectId: "weizuichat",
  storageBucket: "weizuichat.appspot.com",
  messagingSenderId: "57492612198",
  appId: "1:57492612198:web:4f84241f08d221375c39a7",
  measurementId: "G-7773012QXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()