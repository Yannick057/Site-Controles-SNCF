// firebase-config.js

// Config classique pour usage via <script>
const firebaseConfig = {
  apiKey: "AIzaSyDfToXvTWXnv3VS9SSXT1h7A6iXmmtBMSc",
  authDomain: "controles-sncf.firebaseapp.com",
  projectId: "controles-sncf",
  storageBucket: "controles-sncf.appspot.com",
  messagingSenderId: "782264199437",
  appId: "1:782264199437:web:6a95774348b29fd0fde844"
};

// Initialisation correcte (NE JAMAIS utiliser import/export ici)
firebase.initializeApp(firebaseConfig);
