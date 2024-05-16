import React, { useState, useEffect, useCallback } from "react";
import styled, { css, keyframes } from "styled-components";
import ReactLoading from "react-loading";
import { useGlobalContext } from "../context/context";

const colorList = ["#ff9100", "#00b0ff", "#827717", "#78909c"];

const slideIn = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const LoadingScreenWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  width: 100%;
`;

const LoadingMessage = styled.div`
  position: absolute;
  width: 100%;
  font-size: 24px;
  opacity: 0;
  color: ${(props) => props.color};
  ${({ index, activeindex }) =>
    index === activeindex &&
    css`
      animation: ${slideIn} 1s forwards, ${slideOut} 1s forwards 2s;
    `}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  transition: all 0.3s linear;
  visibility: hidden;
  z-index: -1;
  &.show-modal {
    visibility: visible;
    z-index: 10;
    background: ${(props) => props.background};
  }
`;

const ModalContainer = styled.div`
  border-radius: 0.25rem;
  width: 40%;
  min-height: 30vh;
  text-align: center;
  display: grid;
  place-items: center;
  position: relative;
  @media only screen and (max-width: 560px) {
    width: 90%;
  }
`;

const LoadingScreen = ({ type, messages, background }) => {
  const {
    control: { loading },
  } = useGlobalContext();
  const [activeindex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Interval includes time for both slide in and slide out
    return () => clearInterval(intervalId);
  }, []);

  const setModal = useCallback(() => {
    if (!showModal) loading && setShowModal(true);
    !loading && setShowModal(false);
  }, [loading]);

  useEffect(() => setModal(), [setModal]);

  return (
    <ModalOverlay
      className={`${showModal && "show-modal"}`}
      background={background}
    >
      <ModalContainer>
        <LoadingScreenWrapper>
          <ReactLoading
            type={type}
            height={250}
            color={colorList[activeindex]}
            width={100}
            className="twik"
          />
          {messages.map((message, index) => (
            <LoadingMessage
              key={index}
              index={index}
              activeindex={activeindex}
              color={colorList[index]}
            >
              {message}
            </LoadingMessage>
          ))}
        </LoadingScreenWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoadingScreen;
