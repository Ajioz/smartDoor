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

const VideoPlayer = ({ src, item, cat, id, handleItem }) => {
  const videoRef = useRef(null);

    const handleEdit = (id) => {
      console.log(`item ${id} clicked for edit`);
    };

    const handleDelete = (id) => {
      console.log(`item ${id} clicked for delete`);
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
          <FaEdit color={"#333"} onClick={() => handleEdit(id)} />{" "}
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
