function initialPage() {
    console.log("onLoad function executed");
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    console.log(typeof tasks);

    const taskContainer = document.querySelector(".tasks-list");
    if (tasks) {
        tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-item");
        const formattedDate = task.taskDate.split("-").reverse().join("/");
        const statusIcon =
        task.taskStatus === 1
            ? '<i class="status-icon bi bi-check-circle-fill text-success" title="הושלם"></i>'
            : '<i class="status-icon bi bi-flag-fill text-danger" title="ממתין לביצוע"></i>';
        const completeBtn = task.taskStatus === 1 
            ? `<i class="bi bi-x-circle text-danger"></i> Mark as pending` 
            : `<i class="bi bi-check2-circle text-success"></i> Mark as completed`;
        const innerHTML = `
                        <div class="card task-card" style="width: 22rem; position: relative;">
                            <div class="pin-icon">
                                <i class="bi bi-pin-angle-fill text-primary"></i>
                            </div>
                            <div class="card-body">
                                <button id="delete-btn">
                                    <i class="bi bi-x-circle"></i> 
                                </button>
                                <h5 class="card-title d-flex justify-content-center align-items-center">
                                    ${task.taskName}
                                </h5>
                                ${statusIcon}    
                                <p class="card-text">${task.taskContent}</p>
                                <p class="card-text">${formattedDate}</p>
                                <p class="card-text">${task.taskTime}</p>
                                <button id="complete-btn">
                                    ${completeBtn}
                                </button>
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
    const Id = Number(Date.now()); // Generate a unique ID based on the current timestamp
    const task = {
        taskId: Id,
        taskName: document.getElementById("task").value,
        taskContent: document.querySelector(".notebook").innerText,
        taskDate: document.getElementById("date").value,
        taskTime: document.getElementById("time").value,
        taskStatus: 0,
    };

    const taskContainer = document.querySelector(".tasks-list");
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-item");
    const formattedDate = task.taskDate.split("-").reverse().join("/");
    const statusIcon = `<i class="status-icon bi bi-flag-fill text-danger" title="ממתין לביצוע"></i>`
        // task.taskStatus === 1
        //     ? '<i class="bi bi-check-circle-fill text-success" title="הושלם"></i>'
        //     : '<i class="bi bi-flag-fill text-danger" title="ממתין לביצוע"></i>';

    const innerHTML = `
            <div class="card task-card" style="width: 22rem; position: relative;">
                <div class="pin-icon">
                    <i class="bi bi-pin-angle-fill text-primary"></i>
                </div>
                <div class="card-body">
                    <button id="delete-btn">
                        <i class="bi bi-x-circle"></i>
                    </button>
                    <h5 class="card-title d-flex justify-content-between align-items-center">
                        ${task.taskName}
                    </h5>
                    ${statusIcon}
                    <p class="card-text">${task.taskContent}</p>
                    <p class="card-text">${formattedDate}</p>
                    <p class="card-text">${task.taskTime}</p>
                    <button id="complete-btn">
                        <i class="bi bi-check2-circle text-success"></i> Mark as completed
                    </button>
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

    // Set the ID of the task element to the task ID
    taskElement.id = task.taskId;
    taskContainer.appendChild(taskElement);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function resetFormTask() {
  document.getElementById("task").value = "";
  document.querySelector(".notebook").innerText = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
}

function deleteTask(taskId) {
    const taskContainer = document.querySelector(".tasks-list");
    const taskElement = taskContainer.querySelector(`[id='${taskId}']`);
    console.log(taskId);

    taskContainer.removeChild(taskElement);

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    console.log(tasks.length);
    tasks = tasks.filter((task) => task.taskId !== taskId);
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function completeTask(taskId) {

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = {};
    tasks.forEach((T) => {
        if (T.taskId === taskId) {
            T.taskStatus = T.taskStatus === 1 ? 0 : 1;
            task = T 
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskContainer = document.querySelector(".tasks-list");
    const taskElement = taskContainer.querySelector(`[id='${taskId}']`); // CHECK
    const statusIcon =
        taskElement.querySelector(".bi-flag-fill") ||
        taskElement.querySelector(".bi-check-circle-fill");

    

    // update the status icon
    if (task.taskStatus === 1) {
        statusIcon.classList.remove("bi-flag-fill", "text-danger");
        statusIcon.classList.add("bi-check-circle-fill", "text-success");
        statusIcon.title = "completed";
        // handle the btn
        const completeBtn = taskElement.querySelector("#complete-btn");
        completeBtn.innerHTML = `<i class="bi bi-x-circle text-danger"></i> Mark as pending`;
    }
    // else if (task.taskStatus === 0) {
    else {
        statusIcon.classList.remove("bi-check-circle-fill", "text-success");
        statusIcon.classList.add("bi-flag-fill", "text-danger");
        statusIcon.title = "pending";
        // handle the btn
        const completeBtn = taskElement.querySelector("#complete-btn");
        completeBtn.innerHTML = `<i class="bi bi-check2-circle text-success"></i> Mark as completed`;
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