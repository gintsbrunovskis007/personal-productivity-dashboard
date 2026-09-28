const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

async function renderTasks() {
  taskList.innerHTML = "";
  const response = await fetch("/api/tasks");
  const tasks = await response.json();
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      await renderTasks();
    });
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

renderTasks();

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title === "") {
    alert("Task cant be empty!");
    return;
  }
  await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  taskInput.value = "";
  renderTasks();
});
