import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import styled, { keyframes } from "styled-components";

const slideInAndOut = keyframes`
  0%, 100% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10%, 90% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LoadingScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 97vh;
  background-color: #f3f3f3;
`;

const LoadingMessage = styled.div`
  font-size: 24px;
  margin: 20px auto;
  color: ${(props) => props.color};
  font-family: monospace;
  animation: ${(props) => props.animate};
`;

const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Processing request...",
    "Almost there...",
    "Taking you to the cloud...",
    "Thank you for your patience!",
  ];
  const colorList = ["#ff9100", "#00b0ff", "#827717", "#78909c"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Change message every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <LoadingScreenWrapper>
      <ReactLoading
        type="bubbles"
        color={colorList[messageIndex]}
        width={100}
        className="twik"
      />
      <LoadingMessage color={colorList[messageIndex]} animate={ slideInAndOut}>
        {messages[messageIndex]}
      </LoadingMessage>
    </LoadingScreenWrapper>
  );
};

export default LoadingScreen;
