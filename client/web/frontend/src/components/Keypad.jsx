import React, { useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaEllipsisV,
  FaTrash,
  FaUnlock,
  FaFingerprint,
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
import { details, findItem } from "../utils/handler";
import FingerPrint from "./FingerPrint";
// import { control } from "../data";

const DoorSecurityKeypad = (props) => {
  const { control } = useGlobalContext();
  const navigate = useNavigate();
  const [code, setCode] = useState({ code: "", hideCode: "" });
  const [thumb, setThumb] = useState(false);

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
  };

  const handleBtn = (value) => {
    setCode({
      ...code,
      code: code.code + value,
      hideCode: code.hideCode + "*",
    });
  };

  const handleClear = () => {
    setCode({ ...code, code: "", hideCode: "" });
  };

  // Replace this function with your authentication logic
  const handleUnlock = (id) => {
    const { dbName } = findItem(control, id);
    props.setKeypad({ dbName, code: code.code });
    setCode({ ...code, code: "", hideCode: "" });
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

  const callThumb = () => {
    setThumb(!thumb);
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
              <FaEllipsisV
                color={"#ddd"}
                onClick={() => details(props.id, control, navigate)}
              />
            </ActionBtnContainer>
            <Display>{code.hideCode}</Display>
            {!thumb ? (
              <>
                <div>
                  <KeypadBtn onClick={() => handleBtn("1")}>1</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("2")}>2</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("3")}>3</KeypadBtn>
                </div>
                <div>
                  <KeypadBtn onClick={() => handleBtn("4")}>4</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("5")}>5</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("6")}>6</KeypadBtn>
                </div>
                <div>
                  <KeypadBtn onClick={() => handleBtn("7")}>7</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("8")}>8</KeypadBtn>
                  <KeypadBtn onClick={() => handleBtn("9")}>9</KeypadBtn>
                </div>
                <div>
                  <KeypadBtn onClick={() => handleBtn("0")}>0</KeypadBtn>
                  <KeypadBtn onClick={handleClear}>
                    <FaArrowLeft />
                  </KeypadBtn>
                  <KeypadBtn onClick={callThumb}>
                    <FaFingerprint />
                  </KeypadBtn>
                </div>
                <div>
                  <KeypadBtn onClick={() => handleUnlock(props.id)}>
                    <FaUnlock />
                  </KeypadBtn>
                </div>
              </>
            ) : (
              <>
                <FingerPrint thumb={callThumb} />
              </>
            )}
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
