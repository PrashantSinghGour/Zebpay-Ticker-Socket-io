import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAKvNmxdqKKAnsdH6VQNJvY4T3aF2W7wn4",
  authDomain: "zebpay-ticker.firebaseapp.com",
  projectId: "zebpay-ticker",
  storageBucket: "zebpay-ticker.appspot.com",
  messagingSenderId: "24894946053",
  appId: "1:24894946053:web:4aefd7295e2a960701556c",
  measurementId: "G-K4565TPXJS"
};


const initializeFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}

export { initializeFirebase }
