// models/task.js
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Task;
};
