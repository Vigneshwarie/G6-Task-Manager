// Importing all required methods from the Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { doc, setDoc, getFirestore, getDocs, deleteDoc, query, where, collection } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'

var userLoggedIn;

//Firestore Configuration details
// These details are obtained by configuring the project in the Firebase console.
//https://console.firebase.google.com/project/taskmanager-2990f/overview
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

/** 
 Although the Firebase shares excellent documentation, we needed help using the given code snippets on user action or event listeners. We tried using the Web Modular API model and Web namespaced API; however, we couldn't achieve this requirement, and we lost a couple of days in figuring out the right way of using them. The await operator could not be accessible inside the function. Later, we found a document that says the function needs to be declared async so it can be accessed. This kinda operates like a callback function "then" keyword. The below links were helpful.
 
 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
*/

// Function to add and update data to Firestore
// Different ways of adding data can be referred from the link. https://firebase.google.com/docs/firestore/manage-data/add-data
// One function is to used add and update data
export async function addToFirebase(docId, docText) {
     console.log("Adding Task to Firebase with Id ",docId);
     await setDoc(doc(db, "tasks", docId), docText);
}

// Function to delete data from Firestore
// Multiple ways to delete data is documented here. https://firebase.google.com/docs/firestore/manage-data/delete-data
export async function deleteFromFirebase(docId) {
     console.log("Deleting data from Firestore = ", docId);
     await deleteDoc(doc(db, "tasks", docId));
}

// Function to get all the data according to the user
// Multiple ways to get the data is documented here. https://firebase.google.com/docs/firestore/query-data/get-data
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
// The Firebase documentation on Google authentication, https://firebase.google.com/docs/auth/web/google-signin

export function login() {
     const auth = getAuth();
     signInWithPopup(auth, provider)
     .then((result) => {
          // This gives us a Google Access Token. We can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user);
          userLoggedIn = user;
          // Loading the tasks after user authentication
          getTaskFromStorage(user);
     }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
     });
}

// This function is used to get the logged in user.
export function getUser() { 
     return userLoggedIn;
}