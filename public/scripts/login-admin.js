import app from "../scripts/firebaseConfig.js"; 
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("admin-login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener el documento del usuario desde Firestore
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Verifica si el usuario es admin según el campo `isAdmin` en Firestore
            if (userData.isAdmin) {
                // Redirige al panel de administración si es admin
                window.location.href = "panel-admin.html";
            } else {
                // Muestra el mensaje de acceso denegado con SweetAlert
                await Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: 'No eres administrador.',
                });
                await signOut(auth); // Cierra sesión si no es admin
            }
        } else {
            // Si no se encuentra el usuario en Firestore
            await Swal.fire({
                icon: 'error',
                title: 'Usuario no encontrado',
                text: 'El usuario no existe en la base de datos.',
            });
            await signOut(auth); // Cierra sesión si no existe
        }
    } catch (error) {
        // Muestra el error de inicio de sesión con SweetAlert
        await Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: error.message,
        });
    }
});
