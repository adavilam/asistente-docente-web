// Importa las funciones que necesitas
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

// --- LÓGICA DE LA APLICACIÓN ---

// Función para mostrar los centros del usuario (con mensajes de depuración)
const mostrarSelectorDeCentros = async (userId) => {
    console.log("Paso A: Iniciando mostrarSelectorDeCentros para el usuario:", userId);
    listaCentrosDiv.innerHTML = 'Cargando tus centros...';
    
    const membresiasQuery = query(collection(db, "membresias"), where("userId", "==", userId));
    
    try {
        const membresiasSnapshot = await getDocs(membresiasQuery);
        console.log("Paso B: La consulta de membresías se completó.");

        if (membresiasSnapshot.empty) {
            console.log("Paso C: No se encontraron membresías para este usuario.");
            listaCentrosDiv.innerHTML = 'No estás asignado a ningún centro educativo.';
            return;
        }

        console.log(`Paso D: Se encontraron ${membresiasSnapshot.size} membresías.`);
        listaCentrosDiv.innerHTML = ''; 

        membresiasSnapshot.forEach(async (membresia) => {
            const centroId = membresia.data().centroId;
            console.log("Paso E: Procesando membresía para el centro con ID:", centroId);
            
            const centroDocRef = doc(db, "centros", centroId);
            const centroDoc = await getDoc(centroDocRef);

            if (centroDoc.exists()) {
                console.log("Paso F: El documento del centro existe. Creando botón.");
                const centroData = centroDoc.data();
                const botonCentro = document.createElement('button');
                botonCentro.innerText = centroData.nombreCentro;
                botonCentro.onclick = () => {
                    seleccionarCentro(centroData, centroId);
                };
                listaCentrosDiv.appendChild(botonCentro);
            } else {
                console.error("Paso G: ERROR - El documento para el centro con ID", centroId, "no fue encontrado en la colección 'centros'.");
            }
        });

    } catch (error) {
        console.error("Paso H: ERROR en la consulta