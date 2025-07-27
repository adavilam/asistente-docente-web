import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAnUbit4fLzYDKLdt9KIV2RpT2hhxRk21I",
    authDomain: "asistente-docente-web.firebaseapp.com",
    projectId: "asistente-docente-web",
    storageBucket: "asistente-docente-web.firebasestorage.app",
    messagingSenderId: "472540351675",
    appId: "1:472540351675:web:acd7a1a8be5c6b28572d9e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authSeccion = document.getElementById('auth-seccion');
const appPrincipal = document.getElementById('app-principal');
const userEmailSpan = document.getElementById('user-email');
const unidadesContainer = document.getElementById('unidades-container'); // We'll add this to the HTML

// --- NEW FUNCTION TO LOAD DATA ---
const cargarUnidades = async (userId) => {
    // We'll replace this with a proper list later
    const unidadesList = document.getElementById('unidades-list'); 
    if (!unidadesList) return;
    
    unidadesList.innerHTML = ''; // Clear previous list
    
    // Create a query to get units for the current user
    const q = query(collection(db, "unidades"), where("creadorId", "==", userId));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        unidadesList.innerHTML = '<p>No tienes unidades guardadas todavía.</p>';
        return;
    }
    
    querySnapshot.forEach((doc) => {
        const unidad = doc.data();
        const listItem = document.createElement('li');
        listItem.textContent = `${unidad.nombreUnidad} - Grado: ${unidad.grado}`;
        unidadesList.appendChild(listItem);
    });
};

onAuthStateChanged(auth, user => {
    if (user) {
        authSeccion.style.display = 'none';
        appPrincipal.style.display = 'block';
        userEmailSpan.innerText = user.email;
        cargarUnidades(user.uid); // Load user's units on login
    } else {
        authSeccion.style.display = 'block';
        appPrincipal.style.display = 'none';
    }
});

// ... (rest of the login, register, and logout code remains the same) ...

document.getElementById('form-programacion').addEventListener('submit', async (event) => {
    // ... (form submission code remains the same) ...
    
    // After saving, reload the list of units
    if (auth.currentUser) {
        await cargarUnidades(auth.currentUser.uid);
    }
});