const { Task, User } = require("../models");

// 4.5 → Obtener todas las tareas del usuario autenticado
exports.getTasks = async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.userId } });
  res.json(tasks);
};

// 4.6 → Crear una tarea
exports.createTask = async (req, res) => {
  const { name } = req.body;
  const task = await Task.create({ name, userId: req.userId });
  res.status(201).json(task);
};

// 4.7 → Obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task || task.userId !== req.userId)
    return res.status(404).json({ error: "Tarea no encontrada" });
  res.json(task);
};


// 4.8 → Actualizar nombre
exports.updateTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task || task.userId !== req.userId)
    return res.status(404).json({ error: "Tarea no encontrada" });

  task.name = req.body.name;
  await task.save();
  res.json({ message: "Tarea actualizada" });
};

// 4.9 → Cambiar estado (done)
exports.patchTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task || task.userId !== req.userId)
    return res.status(404).json({ error: "Tarea no encontrada" });

  task.done = req.body.done;
  await task.save();
  res.json({ message: "Estado actualizado" });
};

// 4.10 → Eliminar tarea
exports.deleteTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task || task.userId !== req.userId)
    return res.status(404).json({ error: "Tarea no encontrada" });

  await task.destroy();
  res.json({ message: "Tarea eliminada" });
};

// 4.11 → Obtener tareas de un usuario (por ID)
exports.getUserTasks = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: ["tasks"]
  });

  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json(user.tasks);
};
