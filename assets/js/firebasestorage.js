 import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
          import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
          import { doc, setDoc, getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'
          //console.log(firebase);

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


     await setDoc(doc(db, "tasks", "TAM-20231102020739"), {
          taskDecription: "This is a new task added for testing",
          taskId: "TAM-20231102020739"
     });

     const querySnapshot = await getDocs(collection(db, "tasks"));
     querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
     });