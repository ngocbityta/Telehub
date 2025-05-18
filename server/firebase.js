import admin from "firebase-admin";
import fs from "fs";

let Firestore = null;
let FirebaseStorage = null;

const setupFirebase = () => {
  try {
    const keyPath = "./serviceAccountKey.json";
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

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

export { Firestore, FirebaseStorage };
