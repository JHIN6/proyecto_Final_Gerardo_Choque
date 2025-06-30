const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.getUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "status"] });
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: "El nombre de usuario ya existe" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, { attributes: ["id", "username", "status"] });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  user.username = username;
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  res.json({ message: "Usuario actualizado" });
};

exports.patchUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  user.status = status;
  await user.save();

  res.json({ message: "Estado actualizado" });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  await user.destroy();
  res.json({ message: "Usuario eliminado" });
};

exports.getUsersPaginated = async (req, res) => {
  let { page = 1, limit = 10, search = "", orderBy = "id", orderDir = "DESC" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const validOrderBy = ["id", "username", "status"];
  const validOrderDir = ["ASC", "DESC"];
  if (!validOrderBy.includes(orderBy)) orderBy = "id";
  if (!validOrderDir.includes(orderDir.toUpperCase())) orderDir = "DESC";

  const where = search ? { username: { [Op.like]: `%${search}%` } } : {};

  try {
    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderBy, orderDir]],
      attributes: ["id", "username", "status"]
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios paginados" });
  }
};
