import React, { useState } from "react";
import "./keypad.css";

const Keypad = () => {
  const [inputValue, setInputValue] = useState("");

  // Function to handle key press
  const handleKeyPress = (key) => {
    setInputValue((prevValue) => prevValue + key);
  };

  // Function to handle backspace
  const handleBackspace = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const handlesubmit = () => {
    console.log("Open")
  }

  return (
    <div className="keyboard-container">
      <input type="text" value={inputValue} readOnly />
      <div className="keyboard">
        <div className="keyboard-row">
          <button onClick={() => handleKeyPress("1")}>1</button>
          <button onClick={() => handleKeyPress("2")}>2</button>
          <button onClick={() => handleKeyPress("3")}>3</button>
        </div>
        <div className="keyboard-row">
          <button onClick={() => handleKeyPress("4")}>4</button>
          <button onClick={() => handleKeyPress("5")}>5</button>
          <button onClick={() => handleKeyPress("6")}>6</button>
        </div>
        <div className="keyboard-row">
          <button onClick={() => handleKeyPress("7")}>7</button>
          <button onClick={() => handleKeyPress("8")}>8</button>
          <button onClick={() => handleKeyPress("9")}>9</button>
        </div>
        <div className="keyboard-row">
          <button onClick={() => handleBackspace()}>&lt;</button>
          <button onClick={() => handleKeyPress("0")}>0</button>
          <button onClick={handlesubmit}>Open</button>
          {/* Add more keys as needed */}
        </div>
      </div>
    </div>
  );
};

export default Keypad;
