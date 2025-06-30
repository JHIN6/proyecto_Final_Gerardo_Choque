// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Task = require("./task")(sequelize, DataTypes);

// Asociaciones
db.User.hasMany(db.Task, { foreignKey: "userId", as: "tasks" });
db.Task.belongsTo(db.User, { foreignKey: "userId", as: "user" });

module.exports = db;
