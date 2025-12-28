import { useEffect, useState } from "react";
import api from "../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  // Update task status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Your Tasks</h3>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Task Form */}
      <form className="mb-4" onSubmit={createTask}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
       <ul className="list-group">
  {tasks.map((task) => (
    <li key={task.id} className="list-group-item mb-2">
      <strong>{task.title}</strong> — {task.status}
      {task.description && (
        <>
          <br />
          <i>Description:</i> {task.description}
        </>
      )}
    <br />
      <div className="mt-2 btn-group btn-group-sm">
        <button
          className={
            task.status === "pending"
              ? "btn btn-secondary"
              : "btn btn-outline-secondary"
          }
          onClick={() => updateStatus(task.id, "pending")}
        >
          Pending
        </button>

        <button
          className={
            task.status === "in_progress"
              ? "btn btn-info text-white"
              : "btn btn-outline-info"
          }
          onClick={() => updateStatus(task.id, "in_progress")}
        >
          In Progress
        </button>

        <button
          className={
            task.status === "done"
              ? "btn btn-success"
              : "btn btn-outline-success"
          }
          onClick={() => updateStatus(task.id, "done")}
        >
          Done
        </button>

        <button
          className="btn btn-outline-danger"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}

export default Tasks;
