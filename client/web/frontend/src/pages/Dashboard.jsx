import React from "react";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import Sidebar from "../components/Sidebar";
import { Button } from "../theme/theme";

const Dashboard = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <main>
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaBars />
      </Button>
      <Sidebar />
    </main>
  );
};

export default Dashboard;
