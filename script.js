let taskList = document.querySelector("#taskList");
let taskArr = [];
let taskIdCounter = 0;

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
  taskList.innerHTML = ""; // Clear existing tasks

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

// Get form and input elements
const addTaskForm = document.getElementById("addTaskForm");
const newTaskInput = document.getElementById("newTask");

// Add Task functionality (handles form submission)
addTaskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const taskText = newTaskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: taskIdCounter++,
    text: taskText,
    completed: false,
  };

  taskArr.push(task);
  saveTasks();
  renderTasks(); //Update the UI
  newTaskInput.value = ""; // Clear the input field
});

//removes the task from the taskList and the taskArr
function handleDeleteTask(task, taskIdx) {
  taskList.removeChild(task);
  taskArr.splice(taskIdx, 1);
  saveTasks();
  renderTasks(); //Update the UI
}

//sets the completed boolean in Task to true and changes the style of the task
function handleCompleteTask(task, taskIdx) {
  taskArr[taskIdx].completed = true;
  task.style.textDecoration = "line-through";
  task.style.color = "grey";
  saveTasks();
  renderTasks(); //Update the UI
}

// Event listener for taskList clicks (delete and complete buttons)
taskList.addEventListener("click", function (event) {
  if (
    event.target.className === "deleteButton" ||
    event.target.className === "completeButton"
  ) {
    const task = event.target.parentElement;
    const taskIdToRemove = parseInt(task.id, 10);
    const taskIdx = taskArr.findIndex(
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
