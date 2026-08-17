let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("smartTasks")) || [];
} catch (error) {
    tasks = [];
}

let currentFilter = "all";


// Date
const today = new Date();

document.getElementById("date").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// Save
function saveTasks() {
    localStorage.setItem("smartTasks", JSON.stringify(tasks));
}


// Add Task
function addTask() {

    const input = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("priority");

    const text = input.value.trim();
    const priority = prioritySelect.value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    input.value = "";

    displayTasks();
}


// Display
function displayTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    let list = tasks;

    if (currentFilter === "pending") {
        list = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        list = tasks.filter(task => task.completed);
    }

    list.forEach(task => {

        const div = document.createElement("div");

        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        div.innerHTML = `
            <input type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})">

            <span class="task-name">
                ${task.text}
            </span>

            <span class="priority">
                ${getIcon(task.priority)} ${task.priority}
            </span>

            <button class="edit-btn"
                onclick="editTask(${task.id})">
                Edit
            </button>

            <button class="done-btn"
                onclick="toggleTask(${task.id})">
                ${task.completed ? "Undo" : "Done"}
            </button>

            <button class="delete-btn"
                onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(div);
    });

    updateProgress();
}


// Priority icon
function getIcon(priority) {

    if (priority === "High") return "🔴";

    if (priority === "Medium") return "🟡";

    if (priority === "Low") return "🟢";

    return "⚪";
}


// Done / Undo
function toggleTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    }
}


// Delete
function deleteTask(id) {

    tasks = tasks.filter(t => t.id !== id);

    saveTasks();

    displayTasks();
}


// Edit
function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const newText = prompt("Edit task:", task.text);

    if (newText && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();

        displayTasks();
    }
}


// Filter
function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();
}


// Progress
function updateProgress() {

    const progressBar =
        document.getElementById("progressBar");

    const progressText =
        document.getElementById("progressText");

    if (tasks.length === 0) {

        progressBar.style.width = "0%";
        progressText.textContent = "0% Completed";

        return;
    }

    const completed =
        tasks.filter(t => t.completed).length;

    const percentage =
        Math.round((completed / tasks.length) * 100);

    progressBar.style.width = percentage + "%";

    progressText.textContent =
        percentage + "% Completed";
}


// Enter key
document.getElementById("taskInput").addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


// Start
displayTasks()