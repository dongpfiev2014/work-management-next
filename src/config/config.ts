// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz6hfdS1ZwchrUQozfiMV_5oIEXtve5oA",
  authDomain: "work-management-428917.firebaseapp.com",
  projectId: "work-management-428917",
  storageBucket: "work-management-428917.appspot.com",
  messagingSenderId: "626486928202",
  appId: "1:626486928202:web:8b877eae371c7d545597b3",
  measurementId: "G-TXDTCXGXHL",
};

let analytics;

if (typeof window !== "undefined") {
  // Chạy trên client-side
  const initializeAnalytics = async () => {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    } else {
      console.log("Firebase Analytics is not supported in this environment");
    }
  };
  initializeAnalytics();
}
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export { analytics };
