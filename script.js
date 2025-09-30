const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const filter = document.getElementById("filter");

// Add task on Enter key
taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load saved tasks when page loads
window.onload = loadTasks;

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.some(t => t.text === taskText)) {
    alert("Task already exists!");
    return;
  }
  // Generate a unique ID for the task
  const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  createTaskElement(taskText, false, taskId);
  saveTask(taskText, taskId);
  taskInput.value = "";
}

// Create task <li>
function createTaskElement(taskText, completed = false, id = null) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");
  // Set data-id attribute for unique identification
  if (id) li.dataset.id = id;

  const span = document.createElement("span");
  span.textContent = taskText;
  span.onclick = () => toggleTask(li);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => deleteTask(li);

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Toggle completed task
function toggleTask(li) {
  li.classList.toggle("completed");
  updateTaskStatus(li.dataset.id, li.classList.contains("completed"));
  filterTasks(); // refresh view according to filter
}

// Delete a task
function deleteTask(li) {
  taskList.removeChild(li);
  removeTask(li.dataset.id);
}

// Save task in localStorage
function saveTask(taskText, id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ id, text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task status
function updateTaskStatus(id, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(t => t.id === id ? { ...t, completed } : t);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove from localStorage
function removeTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(t => createTaskElement(t.text, t.completed, t.id));
}

// Filter tasks
function filterTasks() {
  const filterValue = filter.value;
  const nodes = taskList.childNodes;
  for (const li of nodes) {
    if (li.nodeType !== 1) continue; // skip text nodes
    if (filterValue === "all") {
      li.style.display = "flex";
    } else if (filterValue === "completed") {
      li.style.display = li.classList.contains("completed") ? "flex" : "none";
    } else if (filterValue === "pending") {
      li.style.display = !li.classList.contains("completed") ? "flex" : "none";
    }
  }
}
