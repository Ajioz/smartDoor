import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
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
import { useEffect } from "react";

const Dashboard = () => {
  const {
    showModal,
    showSidebar,
    control,
    isToken,
    setShowModal,
    setShowSidebar,
  } = useGlobalContext();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");

  const handleItem = (id) => {
    setShowModal(!showModal);
    setCategory((prev) => (prev = id));
  };

  useEffect(() => {
    const { status, token } = isToken();
    console.log(control.item);
    if (!status || token === "expired") return navigate("/");
  }, [isToken, navigate, control]);

  return (
    <Container imageurl={dashboard} background={"#212121"}>
      <VerticalSide />
      <Button
        onClick={() => {
          console.log("Clicked");
          setShowSidebar(!showSidebar);
        }}
      >
        <FaArrowRight />
      </Button>
      <Sidebar />
      <DashboardMain>
        <UpperSection>
          <Boardchip />
          {control.item && <AlertNotify status={control.status} />}
        </UpperSection>

        {control.item.length > 0 ? (
          control.item.map((item, index) => (
            <>
              <LowerSection key={index}>
                <LowerContainer>
                  <DoorSecurityKeypad
                    item={item}
                    id={"doorLock"}
                    handleItem={handleItem}
                  />
                  <VideoPlayer
                    item={item}
                    id={"spyCam"}
                    handleItem={handleItem}
                  />
                </LowerContainer>
                <Tag>
                  <p>{item?.name}</p>
                </Tag>
              </LowerSection>
              <Line />
            </>
          ))
        ) : (
          <LowerSection>
            <LowerContainer>
              <DoorSecurityKeypad
                item={false}
                id={"doorLock"}
                handleItem={handleItem}
              />
              <VideoPlayer item={false} id={"spyCam"} handleItem={handleItem} />
            </LowerContainer>
          </LowerSection>
        )}
      </DashboardMain>
      <AddItemForm category={category} />
    </Container>
  );
};

export default Dashboard;
