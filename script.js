const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filter = document.getElementById("filter");

// Load saved tasks when page loads
window.onload = loadTasks;

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText);

  saveTask(taskText);
  taskInput.value = "";
}

// Create task <li>
function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;
  span.onclick = () => toggleTask(li, taskText);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => deleteTask(li, taskText);

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Toggle completed task
function toggleTask(li, taskText) {
  li.classList.toggle("completed");
  updateTaskStatus(taskText, li.classList.contains("completed"));
  filterTasks(); // refresh view according to filter
}

// Delete a task
function deleteTask(li, taskText) {
  taskList.removeChild(li);
  removeTask(taskText);
}

// Save task in localStorage
function saveTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task status
function updateTaskStatus(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(t => t.text === taskText ? { ...t, completed } : t);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove from localStorage
function removeTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(t => createTaskElement(t.text, t.completed));
}

// Filter tasks
function filterTasks() {
  const filterValue = filter.value;
  const tasks = taskList.childNodes;

  tasks.forEach(li => {
    if (li.nodeType !== 1) return; // skip text nodes
    if (filterValue === "all") {
      li.style.display = "flex";
    } else if (filterValue === "completed") {
      li.style.display = li.classList.contains("completed") ? "flex" : "none";
    } else if (filterValue === "pending") {
      li.style.display = !li.classList.contains("completed") ? "flex" : "none";
    }
  });
}
