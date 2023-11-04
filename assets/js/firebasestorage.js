//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { doc, setDoc, getFirestore, getDocs, deleteDoc, collection } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'


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



/*
     await setDoc(doc(db, "tasks", "TAM-20231102020739"), {
          taskDecription: "This is a new task added for testing",
          taskId: "TAM-20231102020739"
     });

*/

export async function addToFirebase(docId, docText) {
 /*     // Method 1
     db.collection("tasks").doc(docId).set({
     taskDecription: docText,
     taskId: docId
     })
     .then(() => {
     console.log("Document added successfully!");
     })
     .catch((error) => {
     console.error("Error writing document: ", error);
     });
*/
     console.log("Adding Task to Firebase with Id ",docId);
     await setDoc(doc(db, "tasks", docId), {
          taskDecription: docText,
          taskId: docId
     });

}


export async function deleteFromFirebase(docId) {
     console.log("Deleting data from Firestore = ", docId);
     // Method 1
   /* db.collection("tasks").doc(docId).delete().then(() => {
          console.log("Document successfully deleted!");
     }).catch((error) => {
          console.error("Error removing document: ", error);
     });     
     
     Method 2
  */
     await deleteDoc(doc(db, "tasks", docId));
   
}

export async function loadDataFromFirebase() {
/*     // Method 1
     db.collection("tasks").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               console.log(doc.id, " => ", doc.data());
          });
     });

     // Method 2
*/
     var tasks = [];
     var tasksObjects = [];
     const querySnapshot = await getDocs(collection(db, "tasks"));
     querySnapshot.forEach((doc) => {
          tasks.push(doc.data());
          tasksObjects.push({ key:doc.id, value:doc.data().taskDecription}) 
          //console.log("This is firebase storage file"+doc.id, " => ", doc.data().taskDecription);
     });
     console.log("Returning from loadDataFromFirebase function", tasksObjects);
     return tasksObjects;
}

