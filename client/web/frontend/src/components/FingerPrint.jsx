import React, { useState } from "react";
import { KeypadBtn } from "../theme/theme";
import { FaKeyboard } from "react-icons/fa";
import styled, { keyframes, css } from "styled-components";
import thumbPrint from "../images/thumb.jpg";

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 150, 255, 1);
  }
`;

const slideIn = keyframes`
  from{
    transform: translateX(100%);
  }
  to{
    transform: translateX(0)
    }
`;

const Finger = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 250px;
  width: 40px;
  cursor: "pointer";
  color: #fff;
  animation: ${slideIn} 0.1s ease-in-out;
`;

const Scanner = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${(prop) => prop.thumbImg});
  background-size: contain;
  background-repeat: no-repeat;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  ${(props) =>
    props.idle &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const ScannerInner = styled.div`
  position: absolute;
  top: 10;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FingerprintPattern = styled.div`
  width: 80%;
  height: 80%;
  background: url("fingerprint.png") no-repeat center center;
  background-size: cover;
`;

const Feedback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.success ? "green" : "red")};
`;

const IconCheck = styled.div`
  &:before {
    content: "\\2713";
    font-size: 2em;
  }
`;

const IconCross = styled.div`
  &:before {
    content: "\\2717";
    font-size: 2em;
  }
`;

const Text = styled.p`
  font-size: 9px;
  width: 100px;
  color: #fff;
  text-align: center;
  text-transform: capitalize;
`;

const FingerPrint = ({ callThumb, getScanID, handleUnlock, id }) => {
  const [idle, setIdle] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleScan = () => {
    if (idle) {
      setIdle(false);
      console.log(scanning);
      handleUnlock(id, false)
      setScanning(true);
      getScanID("ajioziFinger12341!");
      // Simulate scanning process
      setTimeout(() => {
        setScanning(false);
        const success = Math.random() > 0.5; // Random success/failure
        setFeedback(success ? "success" : "failure");
        setTimeout(() => {
          setFeedback(null);
          setIdle(true);
        }, 2000);
      }, 3000); // Scan duration
    }
  };

  return (
    <Finger>
      <Scanner idle={idle} onClick={handleScan} thumbImg={thumbPrint}>
        <ScannerInner>
          <FingerprintPattern />
        </ScannerInner>
        <Feedback show={feedback === "success"} success>
          <IconCheck />
        </Feedback>
        <Feedback show={feedback === "failure"} success={false}>
          <IconCross />
        </Feedback>
      </Scanner>
      <Text>Download Mobile App to use this feature</Text>
      <KeypadBtn onClick={() => callThumb(true)}>
        <FaKeyboard />
      </KeypadBtn>
    </Finger>
  );
};

export default FingerPrint;
