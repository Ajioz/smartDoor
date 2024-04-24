import React, { useRef, useState } from "react";
// import React, { useRef, useState } from "react";
import {
  ActionBtnContainer,
  ExtendContainer,
  // Controls,
  // PlayButton,
  Video,
  VideoPlayerContainer,
} from "../theme/theme";
import AddItemBtn from "./AddItemBtn";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import AddItemForm from "./AddItemForm";

const VideoPlayer = ({ src, item, cat, id, handleItem }) => {
  const videoRef = useRef(null);
  const { control, showModal, setShowModal } = useGlobalContext();

  const [category, setCategory] = useState({
    id: "",
    label1: "Device Category",
    label2: "Name Your Device",
  });

  const createThing = (catID) => {
    setShowModal(!showModal);
    setCategory({ ...category, id: catID });
  };

  const handleEdit = (id, disable, label1, label2) => {
    const name = control.item.find((name) => name._id === id).name;
    handleItem(false, id, disable, label1, label2, cat, name);
    //handleItem(delete, id, disable, label1, label2, category, name);
  };

  const handleDelete = (id) => {
    const itemSpec = control.item.find((name) => name._id === id);
    console.log(itemSpec.name);
    handleItem(true, id, false, " ", " ", itemSpec.category, itemSpec.name);
    //handleItem(delete, id, disable, label1, label2, category, name);
  };

  return (
    <>
      <ExtendContainer width={"37%"}>
        {item ? (
          <VideoPlayerContainer>
            <ActionBtnContainer>
              <FaEdit
                color={"#333"}
                onClick={() =>
                  handleEdit(id, false, "Current Name", "Enter New Name")
                }
              />{" "}
              <FaTrash color={"darkred"} onClick={() => handleDelete(id)} />
            </ActionBtnContainer>
            <Video ref={videoRef} controls>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
          </VideoPlayerContainer>
        ) : (
          <>
            <AddItemBtn cat={"spyCam"} handleItem={createThing} />
            <AddItemForm
              status={true}
              del={true}
              id={category.id}
              label1={category.label1}
              label2={category.label2}
              name={"spyCam"}
              category={"spyCam"}
            />
          </>
        )}
      </ExtendContainer>
    </>
  );
};

export default VideoPlayer;
