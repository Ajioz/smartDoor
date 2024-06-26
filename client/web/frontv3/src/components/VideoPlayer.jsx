import React, { useRef } from "react";
import {
  ActionBtnContainer,
  ExtendContainer,
  Video,
  VideoPlayerContainer,
} from "../theme/theme";
import AddItemBtn from "./AddItemBtn";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { details, findItem } from "../utils/handler";
// import { control } from "../data";

const VideoPlayer = ({ src, item, cat, id, handleItem }) => {
  const videoRef = useRef(null);
  const { control } = useGlobalContext();
  const navigate = useNavigate();

  const handleEdit = (id, disable, label1, label2) => {
    const { name } = findItem(control, id);
    handleItem(false, id, disable, label1, label2, cat, name, "EDIT");
    //handleItem(delete, id, disable, label1, label2, category, name, action);
  };

  const handleDelete = (id) => {
    const itemSpec = findItem(control, id);
    console.log(itemSpec.name);
    handleItem(
      true,
      id,
      false,
      " ",
      " ",
      itemSpec.category,
      itemSpec.name,
      "DELETE"
    );
    //handleItem(delete, id, disable, label1, label2, category, name, action);
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
              <FaEllipsisV
                color={"#333"}
                onClick={() => details(id, control, navigate)}
              />
            </ActionBtnContainer>
            <Video ref={videoRef} controls>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
          </VideoPlayerContainer>
        ) : (
          <AddItemBtn
            new={true}
            cat={"spyCam"}
            label1={"Device Category"}
            label2={"Name Your Device"}
            handleItem={handleItem}
            action={"CREATE"}
          />
        )}
      </ExtendContainer>
    </>
  );
};

export default VideoPlayer;
