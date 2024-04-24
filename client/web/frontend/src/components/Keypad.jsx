import React, { useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash, FaUnlock } from "react-icons/fa";
import {
  Display,
  KeypadBtn,
  KeypadContainer,
  ExtendContainer,
  ActionBtnContainer,
} from "../theme/theme";
import AddItemBtn from "./AddItemBtn";
import { useGlobalContext } from "../context/context";

const DoorSecurityKeypad = (props) => {
  const { control } = useGlobalContext();

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

  const handleEdit = (id, disable, label1, label2) => {
    const name = control.item.find((name) => name._id === id).name;
    props.handleItem(false, id, disable, label1, label2, props.cat, name);
    //handleItem(delete, id, disable, label1, label2, category, name);
  };

  const handleDelete = (id) => {
    const itemSpec = control.item.find((name) => name._id === id);
    console.log(itemSpec.name);
    props.handleItem(
      true,
      id,
      false,
      " ",
      " ",
      itemSpec.category,
      itemSpec.name
    );
    //handleItem(delete, id, disable, label1, label2, category, name);
  };
  return (
    <>
      <ExtendContainer width={"220px"}>
        {props.item ? (
          <KeypadContainer>
            <ActionBtnContainer>
              <FaEdit
                color={"#333"}
                onClick={() =>
                  handleEdit(props.id, false, "Current Name", "Enter New Name")
                }
              />{" "}
              <FaTrash
                color={"darkred"}
                onClick={() => handleDelete(props.id)}
              />
            </ActionBtnContainer>
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
          <AddItemBtn
            new={true}
            cat={"doorLock"}
            label1={"Device Category"}
            label2={"Name Your Device"}
            handleItem={props.handleItem}
          />
        )}
      </ExtendContainer>
    </>
  );
};

export default DoorSecurityKeypad;
