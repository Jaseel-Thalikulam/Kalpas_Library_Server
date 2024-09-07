import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import serviceAccount from "./firebase.secret.json";
import { FIREBASE_SERVICE_ACCOUNT_BASE_64, FIREBASE_STORAGE_BUCKET } from "../constants";

const FIREBASE_SERVICE_ACCOUNT = JSON.parse(
  Buffer.from(FIREBASE_SERVICE_ACCOUNT_BASE_64!, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(
    FIREBASE_SERVICE_ACCOUNT as admin.ServiceAccount
  ),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

export const uploadFileAndGetPublicUrl = async (filePath: string) => {
  try {
    // Upload file to Firebase Storage
    const [file] = await bucket.upload(filePath);

    // Get the file's public URL
    const fileName = path.basename(filePath);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media`;

    // Delete the local file
    fs.unlinkSync(filePath);

    // Return the public URL
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file and getting public URL:", error);
    throw error;
  }
};
