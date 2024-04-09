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
  const [category, setCategory] = useState("");

  const handleItem = (id) => {
    setShowModal(!showModal);
    setCategory((prev) => (prev = id));
  };

  return (
    <Container background="#607d8b" imageurl={bgImg}>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <AddContainer>
        <AddItemBtn id={"doorLock"} handleItem={handleItem} />
        <AddItemBtn id={"spyCam"} handleItem={handleItem} />
        <AddItemForm category={category} />
      </AddContainer>
    </Container>
  );
};

export default AddDoors;
