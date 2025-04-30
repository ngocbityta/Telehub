const admin = require("firebase-admin");
const fs = require("fs");

let Firestore = null;
let FirebaseStorage = null;

const setupFirebase = () => {
  try {
    const keyPath = "./serviceAccountKey.json";
    if (fs.existsSync(keyPath)) {
      const serviceAccount = require(keyPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "gs://chatk-420915.appspot.com",
      });
      Firestore = admin.firestore();
      FirebaseStorage = admin.storage();
      console.log("✅ Firebase initialized.");
    } else {
      console.log("⚠️ Firebase key not found. Skipping Firebase setup.");
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
};

setupFirebase();

module.exports = { Firestore, FirebaseStorage };
