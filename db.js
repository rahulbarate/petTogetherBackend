
// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

var admin = require("firebase-admin");
var serviceAccount = require("./credentials/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
//use const db = require(./db.js)
// const res = db.collection("Users").add({userTypeName:"shopKeeper"});