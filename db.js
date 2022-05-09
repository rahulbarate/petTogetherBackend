
// const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase-admin/firestore');

// const firebaseConfig = {
//   apiKey: "AIzaSyCqNVsAwDkUO9bFdR8Nsk90oIiJ3-32iz0",
//   authDomain: "pettogether-f16ce.firebaseapp.com",
//   projectId: "pettogether-f16ce",
//   storageBucket: "pettogether-f16ce.appspot.com",
//   messagingSenderId: "469580353698",
//   appId: "1:469580353698:web:6092939d99574b9dcd47fb",
//   measurementId: "G-77T5QY3X4J"
// };


var admin = require("firebase-admin");
var serviceAccount = require("./credentials/serviceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// const app = initializeApp(firebaseConfig);
const db = getFirestore();

module.exports = db;
// module.exports = app;
//use const db = require(./db.js)
// const res = db.collection("Users").add({userTypeName:"shopKeeper"});