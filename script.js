// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAnUbit4fLzYDKLdt9KIV2RpT2hhxRk21I",
    authDomain: "asistente-docente-web.firebaseapp.com",
    projectId: "asistente-docente-web",
    storageBucket: "asistente-docente-web.firebasestorage.app",
    messagingSenderId: "472540351675",
    appId: "1:472540351675:web:acd7a1a8be5c6b28572d9e"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias a elementos del HTML
const authSeccion = document.getElementById('auth-seccion');
const appPrincipal = document.getElementById('app-principal');
const userEmailSpan = document.getElementById('user-email');
const seleccionCentroDiv = document.getElementById('seleccion-centro');
const listaCentrosDiv = document.getElementById('lista-centros');
const dashboardCentroDiv = document.getElementById('dashboard-centro');
const unidadesList = document.getElementById('unidades-list');

// --- LÓGICA DE LA APLICACIÓN ---

// Carga las unidades filtrando por usuario Y por centro
const cargarUnidadesPorCentro = async (userId, centroId) => {
    unidadesList.innerHTML = 'Cargando unidades...';

    // Consulta con doble filtro
    const q = query(collection(db, "unidades"), 
                      where("creadorId", "==", userId), 
                      where("centroId", "==", centroId));
    
    const querySnapshot = await getDocs(q);
    
    unidadesList.innerHTML = ''; // Limpia la lista

    if (querySnapshot.empty) {
        unidadesList.innerHTML = '<li>No tienes unidades guardadas para este centro.</li>';
    } else {
        querySnapshot.forEach((doc) => {
            const unidad = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `${unidad.nombreUnidad} - Grado: ${unidad.grado}`;
            unidadesList.appendChild(listItem);
        });
    }
};

// Función para mostrar los centros del usuario
const mostrarSelectorDeCentros = async (userId) => {
    listaCentrosDiv.innerHTML = 'Cargando tus centros...';
    
    const membresiasQuery = query(collection(db, "membresias"), where("userId", "==", userId));
    const membresiasSnapshot = await getDocs(membresiasQuery);

    if (membresiasSnapshot.empty) {
        listaCentrosDiv.innerHTML = 'No estás asignado a ningún centro educativo.';
        return;
    }

    listaCentrosDiv.innerHTML = ''; 

    membresiasSnapshot.