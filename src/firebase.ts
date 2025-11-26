import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHOJV-XDgOpkQxjj5rswl0W_PPPenz-oY",
  authDomain: "agriraiz.firebaseapp.com",
  projectId: "agriraiz",
  storageBucket: "agriraiz.firebasestorage.app",
  messagingSenderId: "410917353112",
  appId: "1:410917353112:web:d1adce44b4be5ae81d42ed"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);