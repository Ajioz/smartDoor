import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import Sidebar from "../components/Sidebar";
import { Button, Container, VerticalSide } from "../theme/theme";
import dashboard from "../images/dashboard2.jpg";

const Dashboard = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <Container imageUrl={dashboard}>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
    </Container>
  );
};

export default Dashboard;
