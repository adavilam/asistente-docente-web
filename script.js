console.log("Punto 1: Script iniciado.");

// Importa todas las funciones que usaremos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

console.log("Punto 2: Módulos de Firebase importados.");

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

console.log("Punto 3: Firebase inicializado.");

// Referencias a elementos del HTML
const authSeccion = document.getElementById('auth-seccion');
const appPrincipal = document.getElementById('app-principal');
const userEmailSpan = document.getElementById('user-email');
const seleccionCentroDiv = document.getElementById('seleccion-centro');
const listaCentrosDiv = document.getElementById('lista-centros');
const dashboardCentroDiv = document.getElementById('dashboard-centro');

console.log("Punto 4: Elementos del DOM seleccionados.");

// --- MANEJO DE AUTENTICACIÓN ---
console.log("Punto 5: Configurando listener de autenticación...");
onAuthStateChanged(auth, user => {
    console.log("Punto 6: El estado de autenticación ha cambiado.");
    if (user) { 
        console.log("Usuario detectado:", user.email);
        authSeccion.style.display = 'none';
        appPrincipal.style.display = 'block';
        userEmailSpan.innerText = user.email;
        mostrarSelectorDeCentros(user.uid);
    } else { 
        console.log("No hay usuario conectado.");
        authSeccion.style.display = 'block';
        appPrincipal.style.display = 'none';
        seleccionCentroDiv.style.display = 'block';
        dashboardCentroDiv.style.display = 'none';
    }
});

// Lógica de Registro
console.log("Punto 7: Configurando listener para el botón de registro...");
document.getElementById('btn-registro').addEventListener('click', () => {
    console.log("Botón de Registro presionado.");
    const email = document.getElementById('registro-email').value;
    const pass = document.getElementById('registro-pass').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .catch(error => console.error("Error registro:", error.message));
});

// Lógica de Login
console.log("Punto 8: Configurando listener para el botón de login...");
document.getElementById('btn-login').addEventListener('click', () => {
    console.log("Botón de Login presionado.");
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    signInWithEmailAndPassword(auth, email, pass)
        .catch(error => console.error("Error login:", error.message));
});

// Lógica de Logout
console.log("Punto 9: Configurando listener para el botón de logout...");
document.getElementById('btn-logout').addEventListener('click', () => {
    console.log("Botón de Logout presionado.");
    signOut(auth);
});

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
        console.error("Paso H: ERROR en la consulta de Firestore:", error);
    }
};
console.log("Punto 10: Script completamente cargado.");