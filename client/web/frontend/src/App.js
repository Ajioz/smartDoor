import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Instruction from "./pages/Instruction";
import AddDoors from "./pages/AddDoors";
import ConfirmPage from "./pages/ConfirmPage";
import Status from "./pages/Status";
import Expired from "./pages/Expired";
import Error from "./pages/Error";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} relative="path" />
          <Route path="/register" element={<Register relative="path" />} />
          <Route path="/dashboard" element={<Dashboard />} relative="path" />
          <Route path="/instruct" element={<Instruction />} relative="path" />
          <Route path="/Add_doors" element={<AddDoors />} relative="path" />
          <Route path="/confirmed" element={<ConfirmPage />} relative="path" />
          <Route path="/status" element={<Status />} relative="path" />
          <Route path="/expired" element={<Expired />} relative="path" />
          <Route path="/*" element={<Error />} relative="path" />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
