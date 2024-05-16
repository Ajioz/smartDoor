import React, { useState } from "react";
import { Button, Container, AddContainer, VerticalSide } from "../theme/theme";
import AddItemForm from "../components/AddItemForm";
import { useGlobalContext } from "../context/context";
import AddItemBtn from "../components/AddItemBtn";
import Sidebar from "../components/Sidebar";
import { FaArrowRight } from "react-icons/fa";
import bgImg from "../images/bg-intro-desktop.png";

const AddDoors = () => {
  const { showModal, showSidebar, setShowModal, setShowSidebar } =
    useGlobalContext();

  const [category, setCategory] = useState({
    id: "",
    label1: "Device Category",
    label2: "Name Your Device",
  });

  const handleItem = (id) => {
    setShowModal(!showModal);
    setCategory({ ...category, id });
  };

  return (
    <Container background="#607d8b" imageurl={bgImg}>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <AddContainer>
        <AddItemBtn cat={"doorLock"} handleItem={handleItem} />
        <AddItemBtn cat={"spyCam"} handleItem={handleItem} />
        <AddItemForm
          status={true}
          category={category.id}
          label1={category.label1}
          label2={category.label2}
          action={"CREATE"}
        />
      </AddContainer>
    </Container>
  );
};

export default AddDoors;
