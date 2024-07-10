import {getFirestore} from "@firebase/firestore";
import {initializeApp} from "@firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCrEho_KsJVYHZrZ6ulffRk14Ti6b6n9G8",
  authDomain: "inkpath-c7206.firebaseapp.com",
  projectId: "inkpath-c7206",
  storageBucket: "inkpath-c7206.appspot.com",
  messagingSenderId: "840548617117",
  appId: "1:840548617117:web:c45ba99afea84dfb61fd74"
};

//initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const  FIRESTORE_DB = getFirestore(FIREBASE_APP);

