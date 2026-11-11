// ======================================
// NUELLA PORTFOLIO - JAVASCRIPT
// ======================================


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close menu after clicking a navigation link

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});


// 2. CURRENT DATE AND YEAR

const currentDate = document.getElementById("current-date");
const currentYear = document.getElementById("current-year");

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-NG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

currentYear.textContent = today.getFullYear();


// 3. ACADEMIC TASK PLANNER

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const plannerFeedback = document.getElementById("planner-feedback");

let tasks = [];


// Load saved tasks

try {
  const savedTasks = localStorage.getItem("nuellaTasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    if (!Array.isArray(tasks)) {
      tasks = [];
    }
  }
} catch (error) {
  tasks = [];
}


// Save tasks

function saveTasks() {
  localStorage.setItem("nuellaTasks", JSON.stringify(tasks));
}


// Display tasks

function displayTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML =
      '<li class="empty-task">No tasks yet. Add your first task!</li>';
  }

  tasks.forEach(function (task) {
    const listItem = document.createElement("li");

    listItem.className = task.completed
      ? "task-item completed"
      : "task-item";

    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";

    const taskName = document.createElement("strong");
    taskName.textContent = task.name;

    const taskDueDate = document.createElement("small");

    taskDueDate.textContent = task.dueDate
      ? "Due: " + task.dueDate
      : "No due date";

    taskDetails.appendChild(taskName);
    taskDetails.appendChild(taskDueDate);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");

    completeButton.type = "button";
    completeButton.textContent = task.completed
      ? "Undo"
      : "Complete";

    completeButton.addEventListener("click", function () {
      toggleTask(task.id);
    });

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    listItem.appendChild(taskDetails);
    listItem.appendChild(actions);

    taskList.appendChild(listItem);
  });

  updateTaskStatistics();
}


// Add a task

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = taskInput.value.trim();
  const dueDate = taskDate.value;

  if (name === "") {
    plannerFeedback.textContent = "Please enter a task.";
    return;
  }

  const newTask = {
    id: Date.now(),
    name: name,
    dueDate: dueDate,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  displayTasks();

  taskForm.reset();

  plannerFeedback.textContent = "Your task was added successfully!";
});


// Mark task as complete or incomplete

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  displayTasks();
}


// Delete a task

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  displayTasks();

  plannerFeedback.textContent = "Task deleted.";
}


// Update statistics

function updateTaskStatistics() {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  taskCount.textContent =
    totalTasks + (totalTasks === 1 ? " task" : " tasks");

  completedCount.textContent =
    completedTasks + " completed";
}


// Display saved tasks when page loads

displayTasks();


// 4. CONTACT FORM VALIDATION

const contactForm = document.getElementById("contact-form");

const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactMessage = document.getElementById("contact-message");

const contactFeedback = document.getElementById("contact-feedback");


// Display validation errors

function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}


// Validate contact form

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Clear previous errors

  showError("name-error", "");
  showError("email-error", "");
  showError("phone-error", "");
  showError("message-error", "");

  contactFeedback.textContent = "";

  let isValid = true;

  const name = contactName.value.trim();
  const email = contactEmail.value.trim();
  const phone = contactPhone.value.trim();
  const message = contactMessage.value.trim();

  // Name validation

  if (name.length < 3) {
    showError("name-error", "Please enter your full name.");
    isValid = false;
  }

  // Email validation

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showError("email-error", "Please enter a valid email address.");
    isValid = false;
  }

  // Nigerian phone number validation

  const phonePattern = /^(\+234|234|0)?[789][01]\d{8}$/;

  const cleanPhone = phone.replace(/[\s-]/g, "");

  if (!phonePattern.test(cleanPhone)) {
    showError("phone-error", "Please enter a valid Nigerian phone number.");
    isValid = false;
  }

  // Message validation

  if (message.length < 10) {
    showError("message-error", "Your message must contain at least 10 characters.");
    isValid = false;
  }

  // Final result

  if (isValid) {
    contactFeedback.textContent =
      "Your form has been validated successfully!";

    contactFeedback.style.color = "#a78bfa";

    contactForm.reset();
  } else {
    contactFeedback.textContent =
      "Please correct the errors above and try again.";

    contactFeedback.style.color = "#ff9999";
  }
});


// 5. CONSOLE MESSAGE

console.log("Welcome to Emmanuella Udemba's Portfolio!");
console.log("NUELLA Portfolio successfully loaded.");