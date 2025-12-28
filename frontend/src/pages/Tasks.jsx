import { useEffect, useState } from "react";
import api from "../api/api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

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

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/tasks/${id}`, { status });
            fetchTasks();
        } catch {
            setError("Failed to update task");
        }
    };

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
            <h2>Your Tasks</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={createTask}>
                <input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />

                <input
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />

                <button type="submit">Add Task</button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id} style={{ marginTop: "10px" }}>
                        <strong>{task.title}</strong> — {task.status}
                        <br />
                        {task.description ? (
                            <>  <br />
                                <i>Description:</i> {task.description}
                            </>
                        ) : (
                            ""
                        )}
                        <br />

                        <button onClick={() => updateStatus(task.id, "pending")}>
                            Pending
                        </button>
                        <button onClick={() => updateStatus(task.id, "in_progress")}>
                            In Progress
                        </button>
                        <button onClick={() => updateStatus(task.id, "done")}>
                            Done
                        </button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasks;
