import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrIWup874iTno478S6WoJPe6QjP85MMKs",
  authDomain: "itd112sample.firebaseapp.com",
  projectId: "itd112sample",
  storageBucket: "itd112sample.appspot.com",
  messagingSenderId: "270407406240",
  appId: "1:270407406240:web:bf62e2109ea0a0decc2fc5",
  measurementId: "G-PHEM6BWWVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };