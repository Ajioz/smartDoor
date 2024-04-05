import React, { useRef, useState } from "react";
import {
  Controls,
  PlayButton,
  Video,
  VideoPlayerContainer,
} from "../theme/theme";

const VideoPlayer = ({ src, item }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {item ? (
        <VideoPlayerContainer>
          <Video ref={videoRef} controls>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
          <Controls>
            <PlayButton onClick={togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </PlayButton>
          </Controls>
        </VideoPlayerContainer>
      ) : (
        <>
          <h3 style={{ background: "#fff" }}>Video + </h3>
        </>
      )}
    </>
  );
};

export default VideoPlayer;
