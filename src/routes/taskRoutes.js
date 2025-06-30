const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

router.use(auth); 

router.get("/", taskController.getTasks); // 4.5
router.post("/", taskController.createTask); // 4.6
router.get("/:id", taskController.getTaskById); // 4.7
router.put("/:id", taskController.updateTask); // 4.8
router.patch("/:id", taskController.patchTask); // 4.9
router.delete("/:id", taskController.deleteTask); // 4.10
router.get("/user/:id/tasks", taskController.getUserTasks); // 4.11

module.exports = router;
