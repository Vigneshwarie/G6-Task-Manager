//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { doc, setDoc, getFirestore, getDocs, deleteDoc, query, where, collection } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'

var userLoggedIn;

var firebaseConfig = {
     apiKey: "AIzaSyAJfwMDC06af6XDiOQUATs79X1KKfIX8XM",
     authDomain: "taskmanager-2990f.firebaseapp.com",
     projectId: "taskmanager-2990f",
     storageBucket: "taskmanager-2990f.appspot.com",
     messagingSenderId: "122085400383",
     appId: "1:122085400383:web:de58ab76a81d48cb0c7d8a"
};

const app = initializeApp(firebaseConfig);
console.log(app);
const db = getFirestore(app);
console.log(db);
const provider = new GoogleAuthProvider();


export async function addToFirebase(docId, docText) {
     console.log("Adding Task to Firebase with Id ",docId);
     await setDoc(doc(db, "tasks", docId), docText);
}


export async function deleteFromFirebase(docId) {
     console.log("Deleting data from Firestore = ", docId);
     await deleteDoc(doc(db, "tasks", docId));
   
}

export async function loadDataFromFirebase(user) {
     var tasks = [];
     var tasksObjects = [];
     //const querySnapshot = await getDocs(collection(db, "tasks"));
     const q = query(collection(db, "tasks"), where("uid", "==", user.uid));

     const querySnapshot = await getDocs(q);

     querySnapshot.forEach((doc) => {
          tasks.push(doc.data());
          tasksObjects.push({ key:doc.id, value:doc.data()}) 
          //console.log("This is firebase storage file"+doc.id, " => ", doc.data().taskDecription);
     });
     console.log("Returning from loadDataFromFirebase function", tasksObjects);
     return tasksObjects;
}

// Authentication Using Firebase Google Authentication
//https://firebase.google.com/docs/auth/web/google-signin?authuser=0&hl=en

export function login() {
     const auth = getAuth();
     signInWithPopup(auth, provider)
     .then((result) => {
     // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.                                               
          const user = result.user;
          console.log(user);
          userLoggedIn = user;
          // Loading the tasks after user authentication
          getTaskFromStorage(user);
          // IdP data available using getAdditionalUserInfo(result)                 
               // ...                                                                    
     }).catch((error) => {
          // Handle Errors here.                                                    
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
     });
}

export function getUser() { 
     return userLoggedIn;
}