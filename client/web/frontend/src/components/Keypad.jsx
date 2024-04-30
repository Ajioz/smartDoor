import React, { useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaEllipsisV,
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
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
// import { control } from "../data";

const DoorSecurityKeypad = (props) => {
  const { control } = useGlobalContext();
  const navigate = useNavigate();
  const [code, setCode] = useState("");


  // The logic below create a new array of video and sensor connectID for parallel mqtt subscription
  /**Mine */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     if (subscriber.dbName.includes("spyCam")) return subscriber.dbName;
  //     let sensor = subscriber.dbName.split("/")
  //     sensor[1] = "/sensor/";
  //     return sensor.join("");
  //   });
  // };

  /**Gimini */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     // Check for "spyCam" first for efficiency
  //     if (subscriber.dbName.includes("spyCam")) return subscriber.dbName;
  //     // Use map to modify the dbName for other subscribers
  //     return subscriber.dbName.replace(/\/([^/]+)\//, "/sensor/");
  //   });
  // };

  /**Meta AI */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     const dbName = subscriber.dbName;
  //     return dbName.includes("spyCam")
  //       ? dbName
  //       : dbName.replace(/\/[^\/]+/, "/sensor/"); //small error
  //   });
  // };

  /**GPT 3.5 */
  const subscribeStack = (arrObj) => {
    return arrObj.map((subscriber) => {
      return subscriber.dbName.includes("spyCam")
        ? subscriber.dbName
        : subscriber.dbName.replace("/", "/sensor/");
    });
  };

  const findItem = (array, id) => {
    return array.item.find((name) => name._id === id);
  };

  const handleButtonClick = (value) => {
    setCode((prevCode) => prevCode + value);
  };

  const handleClear = () => {
    setCode("");
  };

  // Replace this function with your authentication logic
  const handleUnlock = (id) => {
    const { dbName } = findItem(control, id);
    console.log(dbName);
    alert("Door unlocked!");
    setCode("");
  };

  const handleEdit = (id, disable, label1, label2) => {
    const { name } = findItem(control, id);
    props.handleItem(
      false,
      id,
      disable,
      label1,
      label2,
      props.cat,
      name,
      "EDIT"
    );
    //handleItem(delete, id, disable, label1, label2, category, name, action);
    const subscribers = subscribeStack(control.item);
    console.log(subscribers);
  };

  const handleDelete = (id) => {
    const itemSpec = findItem(control, id);
    props.handleItem(
      true,
      id,
      false,
      " ",
      " ",
      itemSpec.category,
      itemSpec.name,
      "DELETE"
    );
    //handleItem(delete, id, disable, label1, label2, category, name, action);
  };

  const details = (id) => {
    const singleItem = control.item.filter((item) => item._id === id);
    navigate("/info", { state: { flag: true, singleItem } });
  };

  return (
    <>
      <ExtendContainer width={"220px"}>
        {props.item ? (
          <KeypadContainer>
            <ActionBtnContainer>
              <FaEdit
                color={"#ddd"}
                onClick={() =>
                  handleEdit(props.id, false, "Current Name", "Enter New Name")
                }
              />{" "}
              <FaTrash color={"#ddd"} onClick={() => handleDelete(props.id)} />
              <FaEllipsisV color={"#ddd"} onClick={() => details(props.id)} />
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
              <KeypadBtn onClick={() => handleUnlock(props.id)}>
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
            action={"CREATE"}
          />
        )}
      </ExtendContainer>
    </>
  );
};

export default DoorSecurityKeypad;
