import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaHo9aZjXB-gRgAvNsnciGIUx4apEosUU",
  authDomain: "xfearyzer-key-system.firebaseapp.com",
  databaseURL: "https://xfearyzer-key-system-default-rtdb.firebaseio.com",
  projectId: "xfearyzer-key-system",
  storageBucket: "xfearyzer-key-system.appspot.com",
  messagingSenderId: "469257270367",
  appId: "1:469257270367:web:0d19458a6d1108b59757ea",
  measurementId: "G-0KGNDZ74DY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("getKeyBtn").addEventListener("click", () => {
    const dbRef = ref(db);
    get(child(dbRef, `keys`)).then((snapshot) => {
        if (snapshot.exists()) {
            const allKeys = snapshot.val();
            const keysArray = Object.keys(allKeys);
            const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
            document.getElementById("keyResult").innerText = randomKey;
        } else {
            document.getElementById("keyResult").innerText = "No keys found.";
        }
    }).catch((error) => {
        console.error(error);
    });
});
