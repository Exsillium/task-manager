import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [view, setView] = useState("login");

  return (
    <div className="container mt-5">
      {!isAuthenticated ? (
        <>
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => setView("login")}
            >
              Login
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setView("register")}
            >
              Register
            </button>
          </div>

          {view === "login" && <Login onLogin={() => setIsAuthenticated(true)} />}
          {view === "register" && <Register />}
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Task Manager</h2>
            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
              }}
            >
              Logout
            </button>
          </div>
          <Tasks />
        </>
      )}
    </div>
  );
}

export default App;
