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
  KeypadBtn as Btn,
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
  const { control, fingerScanner } = useGlobalContext();
  const navigate = useNavigate();
  const [code, setCode] = useState({ code: "", hideCode: "" });
  const [thumb, setThumb] = useState({ thumb: false, pop: false });
  const [finger, setFinger] = useState("");

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

  const isNumeric = (inputString) => {
    // This regex will match any string that contains anything other than digits
    let pattern = /[^0-9]/;
    // If the pattern is found in the inputString, return false
    const state = !pattern.test(inputString);
    return state ? inputString : " ";
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
  const handleUnlock = (id, key) => {
    const { dbName, fName } = findItem(control, id);
    key
      ? props.setKeypad({ dbName: dbName, code: isNumeric(code.code) })
      : props.setKeypad({ dbName: fName, code: finger });
    setCode({ ...code, code: "", hideCode: "" });
  };

  const getScanID = async (finger) => {
    const { secret } = await fingerScanner("thing/finger", { finger });
    setFinger(secret);
    console.log(secret)
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

  const callThumb = (prop) => {
    setThumb({ ...thumb, thumb: !thumb.thumb, pop: prop });
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
            {!thumb.thumb ? (
              <>
                <div>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("1")}>
                    1
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("2")}>
                    2
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("3")}>
                    3
                  </Btn>
                </div>
                <div>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("4")}>
                    4
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("5")}>
                    5
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("6")}>
                    6
                  </Btn>
                </div>
                <div>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("7")}>
                    7
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("8")}>
                    8
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("9")}>
                    9
                  </Btn>
                </div>
                <div>
                  <Btn pop={thumb.pop} onClick={handleClear}>
                    <FaArrowLeft />
                  </Btn>
                  <Btn pop={thumb.pop} onClick={() => handleBtn("0")}>
                    0
                  </Btn>
                  <Btn
                    pop={thumb.pop}
                    onClick={() => handleUnlock(props.id, true)}
                  >
                    <FaUnlock />
                  </Btn>
                </div>
                <div>
                  <Btn pop={thumb.pop} onClick={() => callThumb(false)}>
                    <FaFingerprint />
                  </Btn>
                </div>
              </>
            ) : (
              <>
                <FingerPrint
                  id={props.id}
                  callThumb={callThumb}
                  getScanID={getScanID}
                  handleUnlock={handleUnlock}
                />
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
