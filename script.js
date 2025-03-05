let textField = document.querySelector(".newTask");
let addTaskButton = document.querySelector(".addTask");
let taskList = document.querySelector("#taskList");
let taskArr = [];
let taskIdCounter = 0; //Counter for Task Object IDs

// Load tasks from local storage on page load
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    taskArr = JSON.parse(storedTasks);
    taskIdCounter =
      taskArr.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
    renderTasks();
  }
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

// Render tasks to the taskList
function renderTasks() {
  taskList.innerHTML = "";

  taskArr.forEach((task) => {
    createTaskElement(task);
  });
}

//create a single-task element
function createTaskElement(task) {
  let currTask = document.createElement("li");
  currTask.className = "task";
  currTask.textContent = task.text;
  currTask.id = task.id;

  let completeButton = document.createElement("button");
  completeButton.className = "completeButton";
  completeButton.textContent = "Complete Task";
  currTask.appendChild(completeButton);

  let deleteButton = document.createElement("button");
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "Delete Task";
  currTask.appendChild(deleteButton);

  if (task.completed) {
    currTask.style.textDecoration = "line-through";
    currTask.style.color = "grey";
  }

  taskList.appendChild(currTask);
}

addTaskButton.addEventListener("click", function () {
  const taskText = textField.value.trim();
  if (taskText === "") return;

  const taskId = taskIdCounter++;
  const task = {
    id: taskId,
    text: taskText,
    completed: false,
  };

  taskArr.push(task);
  saveTasks();
  createTaskElement(task);
  textField.value = "";
});

//removes the task from the taskList and the taskArr
function handleDeleteTask(task, taskIdx) {
  taskList.removeChild(task);
  taskArr.splice(taskIdx, 1);
  saveTasks();
}

//sets the completed boolean in Task to true and changes the style of the task
function handleCompleteTask(task, taskIdx) {
  taskArr[taskIdx].completed = true;
  task.style.textDecoration = "line-through";
  task.style.color = "grey";
  saveTasks();
  renderTasks();
}

// This function adds an eventListener to the taskList. If a click event happens, it will check to make sure it was from a deleteButton
// It will then target that item and call the appropriate function to handle the event

taskList.addEventListener("click", function (event) {
  if (
    event.target.className === "deleteButton" ||
    event.target.className === "completeButton"
  ) {
    let task = event.target.parentElement;
    let taskIdToRemove = parseInt(task.id, 10);
    let taskIdx = taskArr.findIndex(
      (taskElem) => taskIdToRemove === taskElem.id
    );

    if (taskIdx !== -1) {
      if (event.target.className === "deleteButton") {
        handleDeleteTask(task, taskIdx);
      } else if (event.target.className === "completeButton") {
        handleCompleteTask(task, taskIdx);
      }
    }
  }
});

loadTasks();
