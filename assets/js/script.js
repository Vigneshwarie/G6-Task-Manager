// localstorage key format -> tam-YYYYMMDD

// Element Selection

var taskInput = document.querySelector("#task-text");
var taskForm = document.querySelector("#task-form");
var taskList = document.querySelector("#task-list");
var taskCountSpan = document.querySelector("#task-count");
var submitBtn = document.querySelector("#submitBtn");



// Variable Declarations
var vId;
var inputTextEl;


// A function to load the tasks on page load
// On page load the value is not ordered. Need to be fixed.
// The date parameter need to be aligned with the header date in the HTML.
//https://stackoverflow.com/questions/63636214/jquery-to-retrieve-multiple-keys-with-same-starting-pattern-from-localstorage
function getTaskFromLocalStorage() {
     vId = "TAM-" + dayjs().format('YYYYMMDD');
     Object.entries(localStorage).forEach(([key, value]) => {
     if (key.startsWith(vId)) {
          console.log(key + "====" + value);
          var divEl = document.createElement("div");
          divEl.classList.add("task-item");
          var idAttr = document.createAttribute("item-id");
          idAttr.value = key;
          divEl.setAttributeNode(idAttr);
          divEl.innerHTML = ` <p class="showElement">${value}</p>
                                        <div class="showElement">
                                             <button type="button" class="editbtn">Edit</button>
                                             <button type="button" class="deletebtn">Delete</button>
                                        </div>
                                        <input type="text" id="${key}" value="${value}" class="hideElement">
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

// A function to add task to local storage
function addTaskToLocalStorage(taskKey, taskValue) {
     localStorage.setItem(taskKey, taskValue);
}

// A function to delete task from local storage
function deleteTaskFromLocalStorage(taskKey) {
     localStorage.removeItem(taskKey);
}

// EventListeners
taskForm.addEventListener("submit", addTaskItem);
getTaskFromLocalStorage();







