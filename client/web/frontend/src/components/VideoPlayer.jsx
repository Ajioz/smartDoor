import React, { useRef } from "react";
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
import { control } from "../data";

const VideoPlayer = ({ src, item, cat, id, handleItem }) => {
  const videoRef = useRef(null);

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

  // const [isPlaying, setIsPlaying] = useState(false);

  // const togglePlay = () => {
  //   if (videoRef.current.paused) {
  //     videoRef.current.play();
  //     setIsPlaying(true);
  //   } else {
  //     videoRef.current.pause();
  //     setIsPlaying(false);
  //   }
  // };

  return (
    <>
      <ExtendContainer width={"37%"}>
        <ActionBtnContainer>
          <FaEdit
            color={"#333"}
            onClick={() =>
              handleEdit(id, false, "Current Name", "Enter New Name")
            }
          />{" "}
          <FaTrash color={"darkred"} onClick={() => handleDelete(id)} />
        </ActionBtnContainer>
        {item ? (
          <VideoPlayerContainer>
            <Video ref={videoRef} controls>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
            {/* <Controls>
            <PlayButton onClick={togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </PlayButton>
          </Controls> */}
          </VideoPlayerContainer>
        ) : (
          <>
            <AddItemBtn cat={cat} handleItem={handleItem} />
          </>
        )}
      </ExtendContainer>
    </>
  );
};

export default VideoPlayer;
