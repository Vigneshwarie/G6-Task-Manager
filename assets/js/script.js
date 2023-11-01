// localstorage key format -> tam-YYYYMMDD

// Element Selection

var taskInput = document.querySelector("#task-text");
var taskForm = document.querySelector("#task-form");
var taskList = document.querySelector("#task-list");
var taskCountSpan = document.querySelector("#task-count");
var submitBtn = document.querySelector("#submitBtn");



// Variable Declarations
var isEdit = false;
var vId;


// A function to load the tasks on page load
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
          divEl.innerHTML = ` <p>${value}</p>
                         <div>
                              <button type="button" class="editbtn">Edit</button>
                              <button type="button" class="deletebtn">Delete</button>
                         </div>`;
          var editBtn = divEl.querySelector(".editbtn");
          var deleteBtn = divEl.querySelector(".deletebtn");
          editBtn.addEventListener("click", editTaskItem);
          deleteBtn.addEventListener("click", deleteTaskItem);
          taskList.appendChild(divEl);
     }
     });
     
}

// A function to add the task to localstorage
function addTaskItem(event) {
     event.preventDefault();
     var taskItem = taskInput.value;
     var itemId = "TAM-"+dayjs().format('YYYYMMDDHHmmss')+"";
     if (taskItem && !isEdit) {
          var divEl = document.createElement("div");
          divEl.classList.add("task-item");
          var idAttr = document.createAttribute("item-id");
          idAttr.value = itemId;
          divEl.setAttributeNode(idAttr);
          divEl.innerHTML = ` <p>${taskItem}</p>
                         <div>
                              <button type="button" class="editbtn">Edit</button>
                              <button type="button" class="deletebtn">Delete</button>
                         </div>`;
          
          var editBtn = divEl.querySelector(".editbtn");
          var deleteBtn = divEl.querySelector(".deletebtn");
          editBtn.addEventListener("click", editTaskItem);
          deleteBtn.addEventListener("click", deleteTaskItem);
          taskList.appendChild(divEl);
          addTaskToLocalStorage(itemId, taskItem);
     }
     else if (taskItem && isEdit) {
          
          
     }
     else {
          window.alert("Please add a task to the list");
     }


}

function addTaskToLocalStorage(itemKey, itemValue) {
     localStorage.setItem(itemKey, itemValue);
}

// A function to edit the task to localstorage
function editTaskItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     var itemId = itemElement.getAttribute("item-id")
     var x = event.currentTarget.parentElement;
     var inputText = document.createElement("input");
     var textid = document.createAttribute("id");
     textid.value = itemId;
     inputText.setAttributeNode(textid);
     inputText.value = itemElement.children[0].innerHTML;
     itemElement.removeChild(itemElement.children[0]);
     itemElement.removeChild(itemElement.children[0]);
     itemElement.appendChild(inputText);
     itemElement.appendChild(x);
  
     
     console.log(itemElement);
     console.log(x);

     
}

// A function to delete the task from localstorage
function deleteTaskItem(event) {
     var itemElement = event.currentTarget.parentElement.parentElement;
     taskList.removeChild(itemElement);
     deleteTaskFromLocalStorage(itemElement.getAttribute("item-id"));
}

function deleteTaskFromLocalStorage(itemKey) {
     localStorage.removeItem(itemKey);
}

// EventListeners
taskForm.addEventListener("submit", addTaskItem);
getTaskFromLocalStorage();







