import React, { useState, useRef } from "react";
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
import dashboard from "../images/dashboard.jpg";
import { AlertNotify, Boardchip } from "../components/Chips";
import DoorSecurityKeypad from "../components/Keypad";
import VideoPlayer from "../components/VideoPlayer";
import AddItemForm from "../components/AddItemForm";
import { useEffect } from "react";
// import { control } from "../data";

const Dashboard = () => {
  const {
    showModal,
    showSidebar,
    control,
    isToken,
    setShowModal,
    setShowSidebar,
    fetchData,
  } = useGlobalContext();

  console.log(control)
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    del: false,
    id: "",
    disable: true,
    label1: "Device Category",
    label2: "Name Your Device",
    cat: "",
    name: "",
    action: "",
  });
  const [isDisable, setIsDisable] = useState(false);
  const hasRan = useRef(false);

  const handleItem = (del, id, disable, label1, label2, cat, name, action) => {
    setShowModal(!showModal);
    setIsDisable(disable);
    setCategory({
      ...category,
      del,
      id,
      disable,
      label1,
      label2,
      cat,
      name,
      action,
    });
    //handleItem(delete, id, disable, label1, label2, category, name);
  };

  useEffect(() => {
    const { status, token } = isToken();
    if (!status || token === "expired") return navigate("/");
    isEven(control?.item?.length);
  }, [isToken, navigate, control]);

  useEffect(() => {
    const { status, token } = isToken();
    if (!hasRan.current) {
      if (status) fetchData(token);
      hasRan.current = true;
    }
  }, [fetchData, isToken]);

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
            <LowerContainer
              jjcontent={isEven(control.item.length) ? "flex-end" : "center"}
            >
              {control.item.length > 0 &&
                control.item.map((item, index) => {
                  const { _id, category } = item;
                  let Item =
                    category === "doorLock" ? DoorSecurityKeypad : VideoPlayer;
                  return (
                    <>
                      <Item
                        key={_id}
                        item={true}
                        cat={category}
                        id={_id}
                        handleItem={handleItem}
                      />
                      {isEven(index + 1) && (
                        <>
                          <Tag key={index}>
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
                          cat={category}
                          handleItem={handleItem}
                          id={item._id}
                        />
                      </LowerContainer>
                    </LowerSection>
                  );
                })
              : control.item.length === 0 && (
                  <>
                    <LowerSection jcc={"center"}>
                      <LowerContainer jjcontent={"center"} width={"50%"}>
                        <DoorSecurityKeypad
                          item={false}
                          cat={"doorLock"}
                          handleItem={handleItem}
                        />
                        <VideoPlayer
                          item={false}
                          cat={"spyCam"}
                          handleItem={handleItem}
                        />
                      </LowerContainer>
                    </LowerSection>
                  </>
                )}
          </>
        )}
      </DashboardMain>
      <AddItemForm
        del={category.del}
        id={category.id}
        status={isDisable}
        name={category.name}
        category={category.cat}
        label1={category.label1}
        label2={category.label2}
        action={category.action}
      />
    </Container>
  );
};

export default Dashboard;
