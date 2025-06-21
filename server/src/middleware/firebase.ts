// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHD0B49K3m3cIfE1k1QOs83J1IyHlCsg8",
  authDomain: "otp-demo-43a61.firebaseapp.com",
  projectId: "otp-demo-43a61",
  storageBucket: "otp-demo-43a61.firebasestorage.app",
  messagingSenderId: "306467616802",
  appId: "1:306467616802:web:ed6f3076ae35c86798f27b",
  measurementId: "G-6W7EFX282B"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };


