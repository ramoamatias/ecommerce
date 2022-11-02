import admin from "firebase-admin";
import { readFile } from "fs/promises";
const serviceAccount = JSON.parse(await readFile("../persistencia/credentialFirebase.json"));
export const initFirebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coderhouse-backend-aea65.firebaseio.com",
});

export const bdFirebase = admin.firestore();
