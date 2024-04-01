import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} relative="path" />
          <Route path="/login" element={<Login />} relative="path" />
          <Route path="/register" element={<Register relative="path" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
