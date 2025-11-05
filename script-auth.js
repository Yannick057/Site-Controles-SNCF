// script-auth.js

// Masque/affiche la modale de login
function showLoginForm() {
    document.getElementById("loginModal").style.display = "block";
}
function hideLoginForm() {
    document.getElementById("loginModal").style.display = "none";
}

// Authentification Email/Password Firebase
function loginWithEmail() {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    document.getElementById("authMessage").textContent = "";
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("authMessage").textContent = "";
            hideLoginForm();
        })
        .catch((error) => {
            document.getElementById("authMessage").textContent = "Erreur : " + error.message;
        });
}

function registerWithEmail() {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    document.getElementById("authMessage").textContent = "";
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("authMessage").textContent = "";
            hideLoginForm();
        })
        .catch((error) => {
            document.getElementById("authMessage").textContent = "Erreur : " + error.message;
        });
}

// Authentification GOOGLE
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            hideLoginForm();
        })
        .catch((error) => {
            document.getElementById("authMessage").textContent = "Erreur Google : " + error.message;
        });
}

// Déconnexion
function logoutUser() {
    firebase.auth().signOut();
}

// Affichage dynamique selon l’état utilisateur
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Connecté : affiche toute l'interface, menu user
        document.getElementById("mainApp").style.display = "block";
        document.getElementById("sectionHistorique").style.display = "block";
        document.getElementById("userMenu").style.display = "inline";
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("usernameEmail").textContent = user.email;
        document.getElementById("userInfo").style.display = "inline";
        document.getElementById("loginBtn").style.display = "none";
    } else {
        // Pas connecté : tout masqué sauf la modale login
        document.getElementById("mainApp").style.display = "none";
        document.getElementById("sectionHistorique").style.display = "none";
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("loginBtn").style.display = "inline";
        document.getElementById("loginModal").style.display = "block";
    }
});
