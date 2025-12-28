const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE TASK
 * POST /api/tasks
 */
router.post("/", authMiddleware, (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const query = `
    INSERT INTO tasks (user_id, title, description)
    VALUES (?, ?, ?)
  `;

  db.run(query, [userId, title, description || null], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to create task" });
    }

    res.status(201).json({
      message: "Task created successfully",
      taskId: this.lastID,
    });
  });
});

/**
 * LIST USER TASKS
 * GET /api/tasks
 */
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM tasks
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(query, [userId], (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }

    res.json(tasks);
  });
});

/**
 * UPDATE TASK
 * PUT /api/tasks/:id
 */
router.put("/:id", authMiddleware, (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;
  const userId = req.user.id;

  const query = `
    UPDATE tasks
    SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status)
    WHERE id = ? AND user_id = ?
  `;

  db.run(
    query,
    [title, description, status, taskId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to update task" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task updated successfully" });
    }
  );
});

/**
 * DELETE TASK
 * DELETE /api/tasks/:id
 */
router.delete("/:id", authMiddleware, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  const query = `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [taskId, userId], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete task" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  });
});

module.exports = router;
