const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Rutas públicas
router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);

// Rutas protegidas
router.get("/:id", auth, userController.getUserById); 
router.put("/:id", auth, userController.updateUser);
router.patch("/:id", auth, userController.patchUserStatus);
router.delete("/:id", auth, userController.deleteUser);



router.get("/list/pagination", auth, userController.getUsersPaginated);


module.exports = router;
