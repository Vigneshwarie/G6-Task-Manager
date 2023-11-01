// localstorage key format -> tam-YYYYMMDD

// Element Selection

var taskInput = document.querySelector("#task-text");
var taskForm = document.querySelector("#task-form");
var taskList = document.querySelector("#task-list");
var taskCountSpan = document.querySelector("#task-count");
var submitBtn = document.querySelector("#submitBtn");



// Variable Declarations


var isEdit = false;


// A function to load the tasks on page load

// A function to add the task to localstorage
function addTaskItem(event) {
     event.preventDefault();
     var taskItem = taskInput.value;
     var itemId = dayjs().format('YYYYMMDDHHmmss');
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
          taskList.appendChild(divEl);
     }
     else if (taskItem && isEdit) {
          
     }
     else {
          window.alert("Please add a task to the list");
     }


}

// A function to edit the task to localstorage

// A function to delete the task from localstorage

// EventListeners
taskForm.addEventListener("submit", addTaskItem);







