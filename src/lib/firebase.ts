import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqTWZ8vC5xK3YvC8xK5xK3YvC8xK5xK3Y",
  authDomain: "ai-safescape.firebaseapp.com",
  projectId: "ai-safescape",
  storageBucket: "ai-safescape.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
