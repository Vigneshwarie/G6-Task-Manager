// localstorage key format -> tam-YYYYMMDDhhmmss

// Element Selection

var taskInput = document.querySelector("#task-text");
var taskForm = document.querySelector("#task-form");
var taskList = document.querySelector("#task-list");
var taskCountSpan = document.querySelector("#task-count");
var submitBtn = document.querySelector("#submitBtn");
var modelTrigger = document.querySelectorAll('.js-modal-trigger');
var loginBtn = document.querySelector("#loginBtn");




// Variable Declarations
var vId;


// A function to load the tasks on page load
//https://stackoverflow.com/questions/63636214/jquery-to-retrieve-multiple-keys-with-same-starting-pattern-from-localstorage
function getTaskFromStorage(user) {
     import("./firebasestorage.js").then((module) => {
          console.log("Retrieving Tasks from Firestore");
          var getAllTasksPromise = module.loadDataFromFirebase(user);
          getAllTasksPromise.then(function (tasksFromFirestore) {
               console.log("asynchronous logging has val:", tasksFromFirestore);
               
               vId = "TAM-" + dayjs().format('YYYYMMDD');
               console.log(vId);
               taskList.innerHTML = "";
              // Object.entries(localStorage).forEach(([key, value]) => {
               tasksFromFirestore.forEach((task) => {
                    key = task.key;
                    value = task.value;   
                    // Display data based on the current date. When the if condition is commented all task of that user will be displayed.
                    // This condition is added, so that on future developments, the tasks can be navigated based on dates. 
               //     if (key.startsWith(vId)) {
                         
                         console.log(key + "==im here==" + value);
                         var divEl = document.createElement("div");
                         divEl.classList.add("task-item");
                         var idAttr = document.createAttribute("item-id");
                         idAttr.value = key;
                         divEl.setAttributeNode(idAttr);
                         divEl.innerHTML = ` 
                                                       <div class="showElement">
                                                            <p>${value.taskDecription}</p>
                                                            <button type="button" class="button is-link is-normal" id="editbtn">Edit</button>
                                                            <button type="button" class="button is-link is-normal" id="deletebtn">Delete</button>
                                                       </div>
                                                       <div class="hideElement">
                                                            <input type="text" id="${key}" value="${value.taskDecription}" class="input is-normal">
                                                            <button type="button" class="button is-link is-normal" id="editActionBtn">Edit</button>
                                                       </div>`;
                         var editBtn = divEl.querySelector("#editbtn");
                         var deleteBtn = divEl.querySelector("#deletebtn");
                         editBtn.addEventListener("click", editTaskItem);
                         deleteBtn.addEventListener("click", deleteTaskItem);
                         taskList.appendChild(divEl);
               //     }
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
          divEl.innerHTML = ` 
                                        <div class="showElement">
                                             <p>${taskItem}</p>
                                             <button type="button" class="button is-link is-normal" id="editbtn">Edit</button>
                                             <button type="button" class="button is-link is-normal" id="deletebtn">Delete</button>
                                        </div>
                                        <div class="hideElement">
                                             <input type="text" id="${itemId}" value="${taskItem}" class="input is-normal">
                                             <button type="button" class="button is-link is-normal" id="editActionBtn">Edit</button>
                                        </div>`;
          
          var editBtn = divEl.querySelector("#editbtn");
          var deleteBtn = divEl.querySelector("#deletebtn");
          editBtn.addEventListener("click", editTaskItem);
          deleteBtn.addEventListener("click", deleteTaskItem);
          taskList.appendChild(divEl);
          addTaskToLocalStorage(itemId, taskItem);
          setDefault();
     }
     else {
          //window.alert("Please add a task to the list");
          // Modal Alert is referred based Bulma CSS from the given link https://bulma.io/documentation/components/modal/
          modelTrigger.forEach(($trigger) => {
               const modal = $trigger.dataset.target;
               const $target = document.getElementById(modal);
               openModal($target);
          }); 
     }
}

// A function reset the text box
function setDefault() {
     taskInput.value = "";
}

// A function to toggle the edit event and call the editAction
function editTaskItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;

     if (itemElement.children[0].classList.value === "showElement") {
          itemElement.children[0].classList.value = "hideElement";
          itemElement.children[1].classList.value = "showElement";
     }
     var editActionBtn = itemElement.querySelector("#editActionBtn");
     editActionBtn.addEventListener("click", editItem);
}

// Edit the value and update local storage
function editItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     var value = itemElement.children[1].children[0].value;
     var key = itemElement.children[1].children[0].id;
     itemElement.children[0].children[0].innerHTML = value;
     addTaskToLocalStorage(key, value);
     if (itemElement.children[0].classList.value === "hideElement") {
          itemElement.children[0].classList.value = "showElement";
          itemElement.children[1].classList.value = "hideElement";
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

// Functions to open and close modals
function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}


// EventListeners
taskForm.addEventListener("submit", addTaskItem);
// Opening login page on button click
loginBtn.addEventListener("click", function (e) {
     e.preventDefault();
     import("./firebasestorage.js").then((module) => {
          console.log("Signing in");
          module.login();  
     });
});


function loadUserName() {
     var displayUserNameEl = document.getElementById("displayUserName");
    //loginBtn.createAttribute("style");
     loginBtn.classList.value = "hideElement";
     import("./firebasestorage.js").then((module) => {
          displayUserNameEl.classList.value = "showElement";
          displayUserNameEl.innerHTML = "Hello, " + module.getUser().displayName;
     });
}
     

/*getTaskFromStorage(); */








