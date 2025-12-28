import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [view, setView] = useState("login");

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "2rem" }}>
        <button onClick={() => setView("login")}>Login</button>
        <button onClick={() => setView("register")}>Register</button>

        {view === "login" && (
          <Login onLogin={() => setIsAuthenticated(true)} />
        )}
        {view === "register" && <Register />}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }}
      >
        Logout
      </button>

      <Tasks />
    </div>
  );
}

export default App;
