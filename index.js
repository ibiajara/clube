import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBjp1xZR6T0fBs4uYST8PNV7rC2rUxNjpg",
  authDomain: "e-commerce-3c41b.firebaseapp.com",
  databaseURL: "https://e-commerce-3c41b-default-rtdb.firebaseio.com",
  projectId: "e-commerce-3c41b",
  storageBucket: "e-commerce-3c41b.appspot.com",
  messagingSenderId: "352196438207",
  appId: "1:352196438207:web:40360967b69b7bf4093e0a",
  measurementId: "G-86PHKPHGWE"
});

const db = getDatabase(firebaseApp);
const starCountRef = ref(db, 'sections/');
var arrFB = [];
/*onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
}); */

function showArr(arr) {
  arrFB = arr;
}

async function loadFirebase() {
  await onValue(starCountRef, (snapshot) => {
    showArr(snapshot.val());
  });
}

await loadFirebase();

export default arrFB;