"use strict";

const taskForm = document.forms[0];
const listContainer = document.querySelector(".js--todos-wrapper");
const taskItem = document.querySelector(".todo-item");
const deleteBtn = document.getElementsByClassName("todo-item__delete");

const previousTasks = sessionStorage.getItem("TaskList");
const taskStorage = previousTasks ? JSON.parse(previousTasks) : {};

for (let i in taskStorage) {
  const textCompletedPair = taskStorage[i];
  if (i !== 0) {
    const text = textCompletedPair["task"];
    const completed = textCompletedPair.completed;
    generateTaskBlock(text, completed);
  }
}

function generateTaskBlock(text, check) {
  const newTaskItem = taskItem.cloneNode(true);
  newTaskItem.getElementsByClassName("todo-item__description")[0].textContent =
    text;
  newTaskItem.style.display = "";
  const checker = newTaskItem.querySelector("input");
  checker.checked = check;
  if (check === true) {
    checker.parentElement.classList.add("todo-item--checked");
  }
  listContainer.appendChild(newTaskItem);
}

// On form submit
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formInput = taskForm.elements.value.value;
  generateTaskBlock(formInput, false);
  const id = "TaskId" + Date.now() + Math.random();
  taskStorage[id] = { task: formInput, completed: false };
  taskForm.elements.value.value = "";
});
// On delete click

listContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-item__delete")) {
    const description = event.target.previousElementSibling.textContent;
    event.target.parentElement.remove();

    for (let id in taskStorage) {
      let innerObj = taskStorage[id];
      let text = innerObj.task;
      if (text === description) {
        delete taskStorage[id];
        return;
      }
    }
  }
});

// On checkbox click
listContainer.addEventListener("click", (event) => {
  if (event.target.type === "checkbox") {
    const itemTextContent = event.target.nextElementSibling.textContent;
    if (event.target.checked) {
      for (let id in taskStorage) {
        const innerObj = taskStorage[id];
        const text = innerObj["task"];
        if (text === itemTextContent) innerObj.completed = true;
      }
      event.target.parentElement.classList.add("todo-item--checked");
    } else {
      for (let id in taskStorage) {
        const innerObj = taskStorage[id];
        const text = innerObj["task"];
        if (text === itemTextContent) innerObj.completed = false;
      }
      event.target.parentElement.classList.remove("todo-item--checked");
    }
  }
});

// On reboot
addEventListener("beforeunload", (event) => {
  console.log("beforeunload event triggered");
  const taskStorageStr = JSON.stringify(taskStorage);
  sessionStorage.setItem("TaskList", taskStorageStr);
});
