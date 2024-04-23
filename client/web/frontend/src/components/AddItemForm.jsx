import React, { useState, useRef } from "react";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  ModalContainer,
  CloseModalBtn,
  Form,
  ClaimBtn,
  FormGroup,
  FormField,
  BtnCenter,
} from "../theme/theme";
import { handleItemSubmit } from "../utils/handler";

const AddItemForm = (props) => {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [name, setName] = useState("");

  const { ajiozItem, fetchData, isToken, showModal, setShowModal } =
    useGlobalContext();

  const delay = async (time) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };

  const submitForm = (e) => {
    e.preventDefault();
    let random = Math.floor(Math.random() * 1000);
    let randomDate = Date.now();
    let dbName = `${props.category}/${name
      .split(" ")
      .join("")}${randomDate}${random}`;
    const formData = {
      category: props.category,
      name,
      dbName,
    };
    handleItemSubmit(formData, ajiozItem, hasRun, navigate);
    setName("");
    delay(1000);
    setShowModal(!showModal);
    const { status, token } = isToken();
    if (status) fetchData(token);
  };

  return (
    <div className={`modal-overlay ${showModal && "show-modal"}`}>
      <ModalContainer>
        <Form onSubmit={submitForm}>
          <label htmlFor="type">{props.label1}</label>
          <FormGroup>
            <FormField
              type="text"
              name="category"
              value={props.category}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={props.status}
            />
            <span>{`${new Date().getMinutes()}${new Date().getSeconds()}`}</span>
          </FormGroup>
          <label htmlFor="input">{props.label2}</label>
          <FormGroup>
            <FormField
              type="text"
              placeholder="name"
              name="device"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span>{`${new Date().getMinutes()}${new Date().getSeconds()}`}</span>
          </FormGroup>
          <BtnCenter>
            <ClaimBtn type="submit" disabled={props.status}>
              Register
            </ClaimBtn>
          </BtnCenter>
        </Form>
        <CloseModalBtn onClick={() => setShowModal(!showModal)}>
          <FaTimes />
        </CloseModalBtn>
      </ModalContainer>
    </div>
  );
};

export default AddItemForm;
