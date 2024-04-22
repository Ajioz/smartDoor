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

// const control = {
//   status: false,
//   item: [
//     {
//       _id: 1,
//       category: "doorLock",
//       name: "Front Door",
//       dbName: "frontDoor123445323",
//     },
//     {
//       _id: 2,
//       category: "spyCam",
//       name: "Front Cam",
//       dbName: "frontCam123445323",
//     },
//     {
//       _id: 3,
//       category: "doorLock",
//       name: "Mid Door",
//       dbName: "frontDoor123445323",
//     },
//     {
//       _id: 4,
//       category: "spyCam",
//       name: "Mid Cam",
//       dbName: "frontCam123445323",
//     },
//     {
//       _id: 5,
//       category: "doorLock",
//       name: "Back Door",
//       dbName: "frontDoor123445323",
//     },
//     {
//       _id: 6,
//       category: "spyCam",
//       name: "Back Cam",
//       dbName: "frontCam123445323",
//     },
//   ],
//   loading: false,
// };

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
    if (!status || token === "expired") return navigate("/");
  }, [isToken, navigate]);

  const isEven = (values) => {
    if (values % 2 === 0) return true;
    return false;
  };

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
          {control.item.length > 0 &&
            control.item[0].category === "doorLock" && (
              <AlertNotify status={control.status} />
            )}
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
                      {isEven(index + 1) && (
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
        </>
        {control.item.length !== 2 && (
          <>
            {control.item.length === 1
              ? control.item.map((item, _i) => {
                  let Item =
                    item.category === "doorLock"
                      ? VideoPlayer
                      : DoorSecurityKeypad;
                  let category =
                    item.category === "doorLock" ? "spyCam" : "doorLock";
                  return (
                    <LowerSection>
                      <LowerContainer>
                        <Item
                          item={false}
                          id={category}
                          handleItem={handleItem}
                        />
                      </LowerContainer>
                    </LowerSection>
                  );
                })
              : control.item.length === 0 && (
                  <>
                    <LowerSection>
                      <LowerContainer>
                        <DoorSecurityKeypad
                          item={false}
                          id={"doorLock"}
                          handleItem={handleItem}
                        />
                        <VideoPlayer
                          item={false}
                          id={"spyCam"}
                          handleItem={handleItem}
                        />
                      </LowerContainer>
                    </LowerSection>
                  </>
                )}
          </>
        )}
      </DashboardMain>
      <AddItemForm category={category} />
    </Container>
  );
};

export default Dashboard;
