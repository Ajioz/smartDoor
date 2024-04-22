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

const control = {
  status: false,
  item: [
    {
      _id: 1,
      category: "doorLock",
      name: "Front Door",
      dbName: "frontDoor123445323",
    },
    {
      _id: 2,
      category: "spyCam",
      name: "Front Cam",
      dbName: "frontCam123445323",
    },
    {
      _id: 3,
      category: "doorLock",
      name: "Mid Door",
      dbName: "frontDoor123445323",
    },
    {
      _id: 4,
      category: "spyCam",
      name: "Mid Cam",
      dbName: "frontCam123445323",
    },
  ],
  loading: false,
};

const Dashboard = () => {
  const {
    showModal,
    showSidebar,
    // control,
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
  }, [isToken, navigate]);

  const isEven = (values) => {
    if ((values+1) % 2 === 0) return true;
    return false
  }

  return (
    <Container imageurl={dashboard} background={"#212121"}>
      <VerticalSide />
      <Button
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <FaArrowRight />
      </Button>
      <Sidebar />
      <DashboardMain>
        <UpperSection>
          <Boardchip />
          {control.item.length > 0 && <AlertNotify status={control.status} />}
        </UpperSection>
        <>
          <LowerSection>
            <LowerContainer>
              {control.item.length > 0 &&
                control.item.map((item, index) => {
                  const { _id, category } = item;
                  let Item =
                    category === "doorLock" ? DoorSecurityKeypad : VideoPlayer;
                  return (
                    <>
                      <Item item={true} id={category} key={_id} />
                      {isEven(index) && (
                        <>
                          <Tag>
                            <p>{control.item[index].name}</p>
                          </Tag>
                          <Line />;
                        </>
                      )}
                    </>
                  );
                })}
            </LowerContainer>
          </LowerSection>
          {/* <Line />; */}
        </>
        {control.item.length === 0 && (
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

// <VideoPlayer
//    item={item}
//    id={item.category}
//    key={item.id}
// />
