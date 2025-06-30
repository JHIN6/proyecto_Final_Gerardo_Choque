require("dotenv").config();

const express = require("express");
const app = express();
const { sequelize } = require("./models");

app.use(express.json());


// Rutas
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
