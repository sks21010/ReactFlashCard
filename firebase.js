// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyAQcrPHaN-twxUPemYvE8L9KB9M9NlinxI",
    authDomain: "flashcardsaas1-fef03.firebaseapp.com",
    projectId: "flashcardsaas1-fef03",
    storageBucket: "flashcardsaas1-fef03.appspot.com",
    messagingSenderId: "794929844605",
    appId: "1:794929844605:web:bfb4a1a503d0e57b83fc14",
    measurementId: "G-V6HYHC0RL1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
export {db};