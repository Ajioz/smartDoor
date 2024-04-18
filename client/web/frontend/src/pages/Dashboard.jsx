import React, { useState } from "react";
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
  LowerContainer,
  Tag,
  Line,
} from "../theme/theme";
import dashboard from "../images/dashboard2.jpg";
import { AlertNotify, Boardchip } from "../components/Chips";
import DoorSecurityKeypad from "../components/Keypad";
import VideoPlayer from "../components/VideoPlayer";
import AddItemForm from "../components/AddItemForm";

const Dashboard = () => {
  const { showModal, showSidebar, status, item, setShowModal, setShowSidebar } =
    useGlobalContext();

  const [category, setCategory] = useState("");

  const handleItem = (id) => {
    setShowModal(!showModal);
    setCategory((prev) => (prev = id));
  };

  return (
    <Container imageurl={dashboard} background={"#212121"}>
      <VerticalSide />
      <Button onClick={() => { console.log("Clicked");  setShowSidebar(!showSidebar)}}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <DashboardMain>
        <UpperSection>
          <Boardchip />
          {item && <AlertNotify status={status} />}
        </UpperSection>

        <LowerSection>
          <LowerContainer>
            <DoorSecurityKeypad
              item={item}
              id={"doorLock"}
              handleItem={handleItem}
            />
            <VideoPlayer item={item} id={"spyCam"} handleItem={handleItem} />
          </LowerContainer>
          <Tag>
            <p>Front Door</p>
          </Tag>
        </LowerSection>
        <Line />
        <LowerSection>
          <LowerContainer>
            <DoorSecurityKeypad
              item={item}
              id={"doorLock"}
              handleItem={handleItem}
            />
            <VideoPlayer item={item} id={"spyCam"} handleItem={handleItem} />
          </LowerContainer>
          <Tag>
            <p>Back Door</p>
          </Tag>
        </LowerSection>
      </DashboardMain>
      <AddItemForm category={category} />
    </Container>
  );
};

export default Dashboard;
