import React, { useState } from "react";
import { FaArrowLeft, FaUnlock } from "react-icons/fa";
import { Display, KeypadButton, KeypadContainer } from "../theme/theme";

const DoorSecurityKeypad = (props) => {
  const [code, setCode] = useState("");

  const handleButtonClick = (value) => {
    setCode((prevCode) => prevCode + value);
  };

  const handleClear = () => {
    setCode("");
  };

  // Replace this function with your authentication logic
  const handleUnlock = () => {
    alert("Door unlocked!");
    setCode("");
  };

  return (
    <KeypadContainer>
      {props.item ? (
        <>
          <Display>{code}</Display>
          <div>
            <KeypadButton onClick={() => handleButtonClick("1")}>
              1
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("2")}>
              2
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("3")}>
              3
            </KeypadButton>
          </div>
          <div>
            <KeypadButton onClick={() => handleButtonClick("4")}>
              4
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("5")}>
              5
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("6")}>
              6
            </KeypadButton>
          </div>
          <div>
            <KeypadButton onClick={() => handleButtonClick("7")}>
              7
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("8")}>
              8
            </KeypadButton>
            <KeypadButton onClick={() => handleButtonClick("9")}>
              9
            </KeypadButton>
          </div>
          <div>
            <KeypadButton onClick={() => handleButtonClick("0")}>
              0
            </KeypadButton>
            <KeypadButton onClick={handleClear}>
              <FaArrowLeft />
            </KeypadButton>
          </div>
          <div>
            <KeypadButton onClick={handleUnlock}>
              <FaUnlock />
            </KeypadButton>
          </div>
        </>
      ) : (
        <>
          <h3>Add + </h3>
        </>
      )}
    </KeypadContainer>
  );
};

export default DoorSecurityKeypad;
