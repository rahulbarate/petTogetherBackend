// Import the functions you need from the SDKs you need
// import { getFirestore } from 'firebase/firestore';

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from 'firebase-admin/compat/firestore';

// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";

const firebase = require("firebase/compat/app");
require("firebase/compat/auth")
require("firebase/compat/firestore")


// const { getFirestore } = require('firebase-admin/firestore');
// import * as firebaseAdmin from 'firebase-admin/firestore';
// import { getAnalytics } from "firebase/analytics";
// import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqNVsAwDkUO9bFdR8Nsk90oIiJ3-32iz0",
  authDomain: "pettogether-f16ce.firebaseapp.com",
  projectId: "pettogether-f16ce",
  storageBucket: "pettogether-f16ce.appspot.com",
  messagingSenderId: "469580353698",
  appId: "1:469580353698:web:44f4876b8f28ae36cd47fb",
  measurementId: "G-30HLQPL3FV"
};

// let app;
// if(firebase.apps.length===0) {
//     app = firebase.initializeApp(firebaseConfig);
// }
// else{
//     app = firebase.app();
// }

// Initialize Firebase
// const analytics = getAnalytics(app);


const app =firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const db =firebase.firestore();
// const db = firebaseAdmin.getFirestore();
// export {db};
module.exports = db;