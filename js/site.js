let TaskData = [];

function preLoad(){
  PrepareLocalStorage();
  ListTasks();
  UpdateTaskCount();
}

function PrepareLocalStorage(){
  if(GetLocalStorage() == null)
  SetLocalStorage(new Array());
}

function GetLocalStorage(){
  return JSON.parse(localStorage.getItem("TaskData"));
}

function SetLocalStorage(data) {
  localStorage.setItem("TaskData", JSON.stringify(data));
}

function CreateTask(){
let tasks = GetLocalStorage();

let task = {}
  task["id"] = GenerateId();
  task["created"] = new Date();
  task["completed"] = false;
  task["title"] = document.getElementById("newTitle").value;
  task["dueDate"] = new Date(document.getElementById("newDueDate").value).toLocaleDateString();


tasks.push(task);
SetLocalStorage(tasks);
ListTasks();
}

function GenerateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function GetTaskId(element){
let taskId = $(element).parent().attr("data-id");
return taskId;
}


function GetIndex(element){
  let taskId = GetTaskId(element);
  let tasks = GetLocalStorage();
  return tasks.findIndex(t => t.id == taskId);
}

function CompleteTask(element){

  let tasks = GetLocalStorage();
  let taskId = GetTaskId(element);
  let task = tasks.find(t => t.id == taskId);
  task.completed = true;
  SetLocalStorage(tasks);
  ListTasks();
}

function EditModal(element){
let tasks = GetLocalStorage();
let taskId = GetTaskId(element);
let task = tasks.find(t => t.id == taskId);

document.getElementById("taskId").value = task.id;
document.getElementById("editTitle").value = task.title;
document.getElementById("editDueDate").value = Date.parse(task.dueDate);
}

function EditTask(){
  //Fires when the user clicks the "edit" button.
  let tasks = GetLocalStorage();
  let taskId = document.getElementById("taskId").value;
  let task = tasks.find(t => t.id == taskId);
  task.title = document.getElementById("editTitle").value;
  task.dueDate = new Date(document.getElementById("editDueDate").value).toLocaleDateString();
  SetLocalStorage(tasks);
  ListTasks();
}

function DeleteTask(){
  
  let index = GetIndex();
  let tasks = GetLocalStorage();
  tasks.splice(index, 1);
  SetLocalStorage(tasks);
  ListTasks();
}


function ListTasks(){
  const template = document.getElementById("data-template");
  const taskBody = document.getElementById("taskBody");

  let tasks = GetLocalStorage();
  //Clear the table
  taskBody.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const dataRow = document.importNode(template.content, true);
    if(tasks[i].completed)
    dataRow.getElementById("TaskRow").setAttribute("class", "complete");

    dataRow.getElementById("id").textContent = tasks[i].id;
    dataRow.getElementById("title").textContent = tasks[i].title;
    dataRow.getElementById("created").textContent = RenderDate(tasks[i].created);
    dataRow.getElementById("dueDate").textContent = RenderDate(tasks[i].dueDate);
    dataRow.getElementById("tdCrud").setAttribute("data-id", tasks[i].id);


    taskBody.appendChild(dataRow);
  }
  UpdateTaskCount();
}

function RenderDate(dateString){
let date = new Date(dateString);
let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
return date.toLocaleString("en-US", options)
}

function ClearTasks(){
  SetLocalStorage(new Array());
  ListTasks();
}

function GetTaskCount() {
  return GetLocalStorage().length;
}

function UpdateTaskCount() {
  let taskCount = GetTaskCount();
  document.getElementById("taskCount").innerText = `(${taskCount})`;
  if(taskCount == 0) {
    document.getElementById("taskCount").innerText = "";
  }
}