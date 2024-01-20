const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*'//para que todos puedan consumir la api
}))
// Array para almacenar las tareas
let tasks = [];

// Ruta GET para obtener la lista de tareas
app.get("/api", (req, res) => {
  res.json({ tasks });
});

// Nueva ruta GET para obtener una tarea por ID
app.get("/api/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ task });
});

// Ruta POST para agregar una nueva tarea
app.post("/api", (req, res) => {
  const newTask = req.body;

  // Validar que se proporcionen los datos necesarios para la tarea
  if (!newTask.title || !newTask.description || !newTask.time) {
    return res.status(400).json({ error: 'Title, description, and time are required' });
  }

  // Añadir la nueva tarea al array de tareas
  newTask.id = tasks.length + 1;
  tasks.push(newTask);

  res.json({ message: 'Task added successfully', task: newTask });
});


// Ruta PATCH para actualizar una tarea por ID
app.patch("/api/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;

  // Buscar la tarea por ID
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  // Si la tarea no se encuentra, devolver un error 404
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Actualizar la tarea con los nuevos datos
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

  res.json({ message: 'Task updated successfully', task: tasks[taskIndex] });
});
// Ruta DELETE para eliminar una tarea por ID


app.delete("/api/:id/", (req, res) => {
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Eliminar la tarea del array
  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.json({ message: 'Task deleted successfully', task: deletedTask });
});


app.listen(5000, () => {
  console.log('Server started on port 5000');
});

