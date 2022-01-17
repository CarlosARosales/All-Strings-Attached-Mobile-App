// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC-SjmJHroCiYPALTZzLG1RpXAvKeFrks",
  authDomain: "fir-auth-912e1.firebaseapp.com",
  projectId: "fir-auth-912e1",
  storageBucket: "fir-auth-912e1.appspot.com",
  messagingSenderId: "154873386153",
  appId: "1:154873386153:web:9aea249538893e944685b8",
  measurementId: "G-K65HZ1JD6V",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
