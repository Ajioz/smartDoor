import React from "react";
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


const Dashboard = () => {
  const { showSidebar, status, item, setShowSidebar } = useGlobalContext();
  return (
    <Container imageUrl={dashboard}>
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
          <DoorSecurityKeypad item={item} />
          <VideoPlayer item={item} />
        </LowerSection>
      </DashboardMain>
    </Container>
  );
};

export default Dashboard;
