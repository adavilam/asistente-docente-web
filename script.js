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

// Función para mostrar los centros del usuario
const mostrarSelectorDeCentros = async (userId) => {
    listaCentrosDiv.innerHTML = 'Cargando tus centros...';
    
    const membresiasQuery = query(collection(db, "membresias"), where("userId", "==", userId));
    
    try {
        const membresiasSnapshot = await getDocs(membresiasQuery);

        if (membresiasSnapshot.empty) {
            listaCentrosDiv.innerHTML = 'No estás asignado a ningún centro educativo.';
            return;
        }

        listaCentrosDiv.innerHTML = ''; 

        // BUCLE CORREGIDO (SOLO HAY UNO)
        membresiasSnapshot.forEach(async (membresia) => {
            const centroId = membresia.data().centroId;
            const centroDocRef = doc(db, "centros", centroId);
            const centroDoc = await getDoc(centroDocRef);

            if (centroDoc.exists()) {
                const centroData = centroDoc.data();
                const botonCentro = document.createElement('button');
                botonCentro.innerText = centroData.nombreCentro;
                botonCentro.onclick = () => {
                    seleccionarCentro(centroData, centroId);
                };
                listaCentrosDiv.appendChild(botonCentro);
            } else {
                console.error("Error: El documento para el centro con ID", centroId, "no fue encontrado.");
            }
        });

    } catch (error) {
        console.error("Error en la consulta de Firestore:", error);
    }
};

// Función que se ejecuta al seleccionar un centro
const seleccionarCentro = (centroData, centroId) => {
    seleccionCentroDiv.style.display = 'none';
    dashboardCentroDiv.style.display = 'block';
    document.getElementById('nombre-centro-seleccionado').innerText = `Trabajando en: ${centroData.nombreCentro}`;
};

// --- MANEJO DE AUTENTICACIÓN ---
onAuthStateChanged(auth, user => {
    if (user) { 
        authSeccion.style.display = 'none';
        appPrincipal.style.display = 'block';
        userEmailSpan.innerText = user.email;
        mostrarSelectorDeCentros(user.uid);
    } else { 
        authSeccion.style.display = 'block';
        appPrincipal.style.display = 'none';
        seleccionCentroDiv.style.display = 'block';
        dashboardCentroDiv.style.display = 'none';
    }
});

// --- CÓDIGO DE LOS BOTONES QUE FALTABA ---

// Lógica de Registro
document.getElementById('btn-registro').addEventListener('click', () => {
    const email = document.getElementById('registro-email').value;
    const pass = document.getElementById('registro-pass').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .catch(error => console.error("Error registro:", error.message));
});

// Lógica de Login
document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    signInWithEmailAndPassword(auth, email, pass)
        .catch(error => console.error("Error login:", error.message));
});

// Lógica de Logout
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth);
});