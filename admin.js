import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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

function generateKey(prefix, role) {
    const random = Math.random().toString(36).substr(2,10).toUpperCase();
    return `${prefix}_${random}`;
}

document.getElementById("createKeyBtn").addEventListener("click", () => {
    const role = document.getElementById("role").value.trim().toUpperCase();
    const expires = document.getElementById("expires").value;
    if (!role || !expires) {
        alert("Please fill all fields");
        return;
    }
    const newKey = generateKey("KEY" + role, role);
    set(ref(db, 'keys/' + newKey), {
        expires: expires,
        status: "active"
    }).then(() => {
        alert("Key created: " + newKey);
        loadKeys();
    });
});

function loadKeys() {
    const dbRef = ref(db);
    get(child(dbRef, `keys`)).then((snapshot) => {
        if (snapshot.exists()) {
            const keys = snapshot.val();
            let html = "<ul>";
            for (let k in keys) {
                html += `<li>${k} - expires: ${keys[k].expires} <button onclick="deleteKey('${k}')">Delete</button></li>`;
            }
            html += "</ul>";
            document.getElementById("keyList").innerHTML = html;
        } else {
            document.getElementById("keyList").innerHTML = "No keys found.";
        }
    });
}

window.deleteKey = function(key) {
    remove(ref(db, 'keys/' + key)).then(() => {
        alert("Key deleted: " + key);
        loadKeys();
    });
}

loadKeys();
