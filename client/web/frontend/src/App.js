import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} relative="path" />
          <Route path="/register" element={<Register relative="path" />} />
          <Route path="/dashboard" element={<Dashboard />} relative="path" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
