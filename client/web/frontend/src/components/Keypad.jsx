import React, { useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";
import {
  Display,
  KeypadBtn,
  KeypadContainer,
  ExtendContainer,
  ActionBtnContainer,
} from "../theme/theme";
import AddItemBtn from "./AddItemBtn";

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

  const handleEdit = (id) => {
    console.log(`item ${id} clicked for edit`)
  }

  const handleDelete = (id) => {
    console.log(`item ${id} clicked for delete`)
  }

  return (
    <>
      <ExtendContainer width={"220px"}>
        <ActionBtnContainer>
          <FaEdit color={"#333"} onClick={() => handleEdit(props.id)} />{" "}
          <FaTrash color={"darkred"} onClick={() => handleDelete(props.id)} />
        </ActionBtnContainer>
        {props.item ? (
          <KeypadContainer>
            <Display>{code}</Display>
            <div>
              <KeypadBtn onClick={() => handleButtonClick("1")}>1</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("2")}>2</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("3")}>3</KeypadBtn>
            </div>
            <div>
              <KeypadBtn onClick={() => handleButtonClick("4")}>4</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("5")}>5</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("6")}>6</KeypadBtn>
            </div>
            <div>
              <KeypadBtn onClick={() => handleButtonClick("7")}>7</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("8")}>8</KeypadBtn>
              <KeypadBtn onClick={() => handleButtonClick("9")}>9</KeypadBtn>
            </div>
            <div>
              <KeypadBtn onClick={() => handleButtonClick("0")}>0</KeypadBtn>
              <KeypadBtn onClick={handleClear}>
                <FaArrowLeft />
              </KeypadBtn>
            </div>
            <div>
              <KeypadBtn onClick={handleUnlock}>
                <FaUnlock />
              </KeypadBtn>
            </div>
          </KeypadContainer>
        ) : (
          <AddItemBtn cat={props.cat} handleItem={props.handleItem} />
        )}
      </ExtendContainer>
    </>
  );
};

export default DoorSecurityKeypad;
