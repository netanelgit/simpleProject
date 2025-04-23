function initialPage() {

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const taskContainer = document.querySelector(".task-container");

    if (tasks) {
        tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-item");
        const formattedDate = task.taskDate.split("-").reverse().join("/");
        const statusIcon =
        task.taskStatus === 1
            ? '<i class="status-icon bi bi-check-circle-fill text-success"></i>'
            : '<i class="status-icon bi bi-flag-fill text-danger"></i>';
        const innerHTML = `
                        <div class="card task-card" style="width: 22rem; position: relative;">
                            <div class="pin-icon">
                                <i class="bi bi-pin-angle-fill text-primary"></i>
                            </div>
                            <div class="card-body">
                                <button id="delete-btn">
                                    <i class="bi bi-x-circle"></i> 
                                </button>
                                <h4 class="card-title d-flex justify-content-center align-items-center">
                                    ${task.taskName}
                                </h4>
                                ${statusIcon}    
                                <p class="card-text task-content">${task.taskContent}</p>
                                <div class="date-and-time">
                                    <p class="card-text">${formattedDate}</p>
                                    <p class="card-text">${task.taskTime}</p>
                                </div>
                            </div>
                        </div>`;
        let safeInput = DOMPurify.sanitize(innerHTML);
        taskElement.innerHTML = safeInput;
        taskElement
            .querySelector("#delete-btn")
            .addEventListener("click", function () {
            deleteTask(task.taskId);
            });
        taskElement
        .querySelector(".status-icon")
        .addEventListener("click", function () {
        completeTask(task.taskId);
        });
        taskElement.id = task.taskId;
        taskContainer.appendChild(taskElement);
        });
    }
}

function addTask() {
    const Id = Number(Date.now()); // the ID equals to the current time in milliseconds
    const task = {
        taskId: Id,
        taskName: document.getElementById("task").value,
        taskContent: document.querySelector(".notebook").innerText,
        taskDate: document.getElementById("date").value,
        taskTime: document.getElementById("time").value,
        taskStatus: 0,
    };

    const taskContainer = document.querySelector(".task-container");
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-item");
    const formattedDate = task.taskDate.split("-").reverse().join("/");

    // I used a Bootstrap card here with its class (and more of my class)
    const innerHTML = `<div class="card task-card" style="width: 22rem; position: relative;">
                            <div class="pin-icon">
                                <i class="bi bi-pin-angle-fill text-primary"></i>
                            </div>
                            <div class="card-body">
                                <button id="delete-btn">
                                    <i class="bi bi-x-circle"></i>
                                </button>
                                <h4 class="card-title d-flex justify-content-between align-items-center">
                                    ${task.taskName}
                                </h4>
                                <i class="status-icon bi bi-flag-fill text-danger"></i>
                                <p class="card-text task-content">${task.taskContent}</p>
                                <div class="date-and-time">
                                    <p class="card-text">${formattedDate}</p>
                                    <p class="card-text">${task.taskTime}</p>
                                </div>
                            </div>
                        </div>`;

    // check if text input is safety
    let safeInput = DOMPurify.sanitize(innerHTML);
    taskElement.innerHTML = safeInput;
    
    // add event listeners
    taskElement.querySelector("#delete-btn")
        .addEventListener("click", function () {
        deleteTask(task.taskId);
        });
    taskElement.querySelector(".status-icon")
        .addEventListener("click", function () {
        completeTask(task.taskId);
        });

    // Set the ID element to the task ID
    taskElement.id = task.taskId;
    taskContainer.appendChild(taskElement);
    
    // save the task in local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function resetFormTask() {

    document.getElementById("task").value = "";
    document.querySelector(".notebook").innerText = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";

    const saveTaskButton = document.getElementById("saveTaskButton");
    saveTaskButton.disabled = true; 
}

function deleteTask(taskId) {
    const taskContainer = document.querySelector(".task-container");
    const taskElement = taskContainer.querySelector(`[id='${taskId}']`);
    taskContainer.removeChild(taskElement);

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter((task) => task.taskId !== taskId);
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function completeTask(taskId) {
    // update task status in local storage
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = {};
    tasks.forEach((T) => {
        if (T.taskId === taskId) {
            T.taskStatus = T.taskStatus === 1 ? 0 : 1;
            task = T 
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskContainer = document.querySelector(".task-container");
    const taskElement = taskContainer.querySelector(`[id='${taskId}']`); 
    const statusIcon =
        taskElement.querySelector(".bi-flag-fill") ||
        taskElement.querySelector(".bi-check-circle-fill");

    // update the status icon
    if (task.taskStatus === 1) {
        statusIcon.classList.remove("bi-flag-fill", "text-danger");
        statusIcon.classList.add("bi-check-circle-fill", "text-success");
        statusIcon.title = "completed";
    }
    // if (task.taskStatus === 0) than:  
    else {
        statusIcon.classList.remove("bi-check-circle-fill", "text-success");
        statusIcon.classList.add("bi-flag-fill", "text-danger");
        statusIcon.title = "pending";
    }  
}

// validate the form before save task
function checkFormCompletion() {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const taskName = document.getElementById("task").value;
    const taskContent = document.querySelector(".notebook").innerText.trim();

    const saveTaskButton = document.getElementById("saveTaskButton");

    // Enable the button if all fields are filled, otherwise disable it
    if (date && time && taskName && taskContent) {
        saveTaskButton.disabled = false;
    } else {
        saveTaskButton.disabled = true;
    }

}

// Add event listeners for validation
document.getElementById("date").addEventListener("input", checkFormCompletion);
document.getElementById("time").addEventListener("input", checkFormCompletion);
document.getElementById("task").addEventListener("input", checkFormCompletion);
document.querySelector(".notebook").addEventListener("input", checkFormCompletion);