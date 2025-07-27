// Tus imports y configuración de Firebase no cambian...
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Tus referencias a elementos del DOM no cambian...
const authSeccion = document.getElementById('auth-seccion');
const appPrincipal = document.getElementById('app-principal');
// ... etc ...

// --- NUEVA FUNCIÓN ---
// Carga las unidades filtrando por usuario Y por centro
const cargarUnidadesPorCentro = async (userId, centroId) => {
    const unidadesList = document.getElementById('unidades-list');
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

// --- FUNCIÓN MODIFICADA ---
// Ahora llama a la función que carga las unidades
const seleccionarCentro = (centroData, centroId) => {
    document.getElementById('seleccion-centro').style.display = 'none';
    document.getElementById('dashboard-centro').style.display = 'block';
    document.getElementById('nombre-centro-seleccionado').innerText = `Trabajando en: ${centroData.nombreCentro}`;
    
    // Llama a la nueva función para cargar las unidades
    if (auth.currentUser) {
        cargarUnidadesPorCentro(auth.currentUser.uid, centroId);
    }
};

// El resto de tu código (onAuthStateChanged, login, registro, etc.) sigue igual.
// Asegúrate de tener el resto del código aquí.
// ...