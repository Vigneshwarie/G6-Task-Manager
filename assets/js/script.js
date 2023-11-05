// localstorage key format -> tam-YYYYMMDDhhmmss

// Element Selection

var taskInput = document.querySelector("#task-text");
var taskForm = document.querySelector("#task-form");
var taskList = document.querySelector("#task-list");
var taskCountSpan = document.querySelector("#task-count");
var submitBtn = document.querySelector("#submitBtn");

// Variable Declarations
var vId;


// A function to load the tasks on page load
// On page load the value is not ordered. Need to be fixed.
// The date parameter need to be aligned with the header date in the HTML.
//https://stackoverflow.com/questions/63636214/jquery-to-retrieve-multiple-keys-with-same-starting-pattern-from-localstorage
function getTaskFromStorage(user) {
     import("./firebasestorage.js").then((module) => {
          console.log("Retrieving Tasks from Firestore");
          var getAllTasksPromise = module.loadDataFromFirebase(user);
          getAllTasksPromise.then(function (tasksFromFirestore) {
               console.log("asynchronous logging has val:", tasksFromFirestore);

               vId = "TAM-" + dayjs().format('YYYYMMDD');
               console.log(vId);
              // Object.entries(localStorage).forEach(([key, value]) => {
               tasksFromFirestore.forEach((task) => {
                    key = task.key;
                    value = task.value;                  
                    if (key.startsWith(vId)) {
                         console.log(key + "==im here==" + value);
                         var divEl = document.createElement("div");
                         divEl.classList.add("task-item");
                         var idAttr = document.createAttribute("item-id");
                         idAttr.value = key;
                         divEl.setAttributeNode(idAttr);
                         divEl.innerHTML = ` <p class="showElement">${value.taskDecription}</p>
                                                       <div class="showElement">
                                                            <button type="button" class="editbtn">Edit</button>
                                                            <button type="button" class="deletebtn">Delete</button>
                                                       </div>
                                                       <input type="text" id="${key}" value="${value.taskDecription}" class="hideElement">
                                                       <div class="hideElement">
                                                            <button type="button" class="editActionBtn">Edit</button>
                                                       </div>`;
                         var editBtn = divEl.querySelector(".editbtn");
                         var deleteBtn = divEl.querySelector(".deletebtn");
                         editBtn.addEventListener("click", editTaskItem);
                         deleteBtn.addEventListener("click", deleteTaskItem);
                         taskList.appendChild(divEl);
                    }
               });                   
          }).catch((err) => {
                console.error(err);
        });      
     });

}

// To prevent user from deleting the task while editing it, two different blocks was created which can be toggled based on the requirement
// Hence, edit functionality is divided into two groups.

// A function to add the task to localstorage
function addTaskItem(event) {
     event.preventDefault();
     var taskItem = taskInput.value;
     var itemId = "TAM-"+dayjs().format('YYYYMMDDHHmmss')+"";
     if (taskItem) {
          var divEl = document.createElement("div");
          divEl.classList.add("task-item");
          var idAttr = document.createAttribute("item-id");
          idAttr.value = itemId;
          divEl.setAttributeNode(idAttr);
          divEl.innerHTML = ` <p class="showElement">${taskItem}</p>
                                        <div class="showElement">
                                             <button type="button" class="editbtn">Edit</button>
                                             <button type="button" class="deletebtn">Delete</button>
                                        </div>
                                        <input type="text" id="${itemId}" value="${taskItem}" class="hideElement">
                                        <div class="hideElement">
                                             <button type="button" class="editActionBtn">Edit</button>
                                        </div>`;
          
          var editBtn = divEl.querySelector(".editbtn");
          var deleteBtn = divEl.querySelector(".deletebtn");
          editBtn.addEventListener("click", editTaskItem);
          deleteBtn.addEventListener("click", deleteTaskItem);
          taskList.appendChild(divEl);
          addTaskToLocalStorage(itemId, taskItem);
          setDefault();
     }
     else {
          window.alert("Please add a task to the list");
     }
}

// A function reset the text box
function setDefault() {
     taskInput.value = "";
}

// A function to toggle the edit event and call the editAction
function editTaskItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     console.log(itemElement);
     if (itemElement.children[0].classList.value === "showElement") {
          itemElement.children[0].classList.value = "hideElement";
          itemElement.children[1].classList.value = "hideElement";
          itemElement.children[2].classList.value = "showElement";
          itemElement.children[3].classList.value = "showElement";
     }
     var editActionBtn = itemElement.querySelector(".editActionBtn");
     editActionBtn.addEventListener("click", editItem);
}

// Edit the value and update local storage
function editItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     var value = itemElement.children[2].value;
     var key = itemElement.children[2].id;
     itemElement.children[0].innerHTML = value;
     addTaskToLocalStorage(key, value);
     if (itemElement.children[0].classList.value === "hideElement") {
          itemElement.children[0].classList.value = "showElement";
          itemElement.children[1].classList.value = "showElement";
          itemElement.children[2].classList.value = "hideElement";
          itemElement.children[3].classList.value = "hideElement";
     }
}

// A function to delete the task 
function deleteTaskItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     taskList.removeChild(itemElement);
     deleteTaskFromLocalStorage(itemElement.getAttribute("item-id"));
}

// A function to add task to local storage and Firestore
// Initially the local storage has provision to store key and value as string. Now it is stored as objects.
function addTaskToLocalStorage(taskKey, taskValue) {
     var taskObject = { taskDecription: taskValue,
          taskId: taskKey
     };

     import("./firebasestorage.js").then((module) => {
          console.log("Storing Task Id " + taskKey + " to Firestore");
          taskObject.uid = module.getUser().uid;
          localStorage.setItem(taskKey, taskObject);
          module.addToFirebase(taskKey, taskObject);

     });
}

// A function to delete task from local storage and Firestore
function deleteTaskFromLocalStorage(taskKey) {
     localStorage.removeItem(taskKey);

     import("./firebasestorage.js").then((module) => {
          console.log("Deleting from Firestore");
          module.deleteFromFirebase(taskKey);
     });
}

// EventListeners
taskForm.addEventListener("submit", addTaskItem);
// On page loads, the login function is called which shows the Google login option
 import("./firebasestorage.js").then((module) => {
          console.log("Signing in");
          module.login();
     });
/*getTaskFromStorage(); */







