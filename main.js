"use strict";

const taskForm = document.forms[0];
const listContainer = document.querySelector(".js--todos-wrapper");
const taskItem = document.querySelector(".todo-item");

let taskStorage = JSON.parse(localStorage.getItem("TaskList")) || [];

for (let i = 0; i < taskStorage.length; i++) {
  const { task, completed } = taskStorage[i];
  generateTaskBlock(task, completed);
}

function generateTaskBlock(text, check) {
  const newTaskItem = taskItem.cloneNode(true);
  newTaskItem.getElementsByClassName("todo-item__description")[0].textContent =
    text;
  newTaskItem.style.display = "";
  const checker = newTaskItem.querySelector("input");
  checker.checked = check;
  if (check) {
    checker.parentElement.classList.add("todo-item--checked");
  }
  listContainer.appendChild(newTaskItem);
}

// On form submit
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formInput = taskForm.elements.value.value;
  if (formInput.trim() === "") {
    alert("Empty input cannot be submitted");
    return;
  }
  const id = "TaskId" + Date.now() + Math.random();
  const newTask = { id: id, task: formInput, completed: false };
  taskStorage.push(newTask);
  localStorage.setItem("TaskList", JSON.stringify(taskStorage));

  generateTaskBlock(formInput, false);
  taskForm.elements.value.value = "";
});

// On delete click
listContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-item__delete")) {
    const description = event.target.previousElementSibling.textContent;
    event.target.parentElement.remove();

    taskStorage = taskStorage.filter((task) => task.task !== description);
    localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  }
});

// On checkbox click
listContainer.addEventListener("click", (event) => {
  if (event.target.type === "checkbox") {
    const itemTextContent = event.target.nextElementSibling.textContent;
    taskStorage = taskStorage.map((taskObj) => {
      if (taskObj.task === itemTextContent) {
        taskObj.completed = !taskObj.completed;
      }
      return taskObj;
    });

    if (event.target.checked) {
      event.target.parentElement.classList.add("todo-item--checked");
    } else {
      event.target.parentElement.classList.remove("todo-item--checked");
    }

    localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  }
});
