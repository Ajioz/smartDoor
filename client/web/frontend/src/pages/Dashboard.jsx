import React, {useState} from "react";
import { FaArrowRight } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import Sidebar from "../components/Sidebar";

import {
  Button,
  Container,
  VerticalSide,
  DashboardMain,
  UpperSection,
  LowerSection,
} from "../theme/theme";
import dashboard from "../images/dashboard2.jpg";
import { AlertNotify, Boardchip } from "../components/Chips";
import DoorSecurityKeypad from "../components/Keypad";
import VideoPlayer from "../components/VideoPlayer";
import AddItemForm from "../components/AddItemForm";

const Dashboard = () => {
  const { showModal, showSidebar, status, item, setShowModal, setShowSidebar } =
    useGlobalContext();
  
  const [category, setCategory] = useState("")

  const handleItem = (id) => {
    setShowModal(!showModal);
    setCategory(prev => prev = id);
  };

  return (
    <Container imageurl={dashboard}>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <DashboardMain>
        <UpperSection>
          <AlertNotify status={status} />
          <Boardchip />
        </UpperSection>
        <LowerSection>
          <DoorSecurityKeypad item={item} id={"doorLock"} handleItem={handleItem} />
          <VideoPlayer item={item} id={"spyCam"} handleItem={handleItem} />
          <AddItemForm category={category} />
        </LowerSection>
      </DashboardMain>
    </Container>
  );
};

export default Dashboard;
