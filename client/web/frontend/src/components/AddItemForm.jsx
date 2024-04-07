import React from "react";
import { useGlobalContext } from "../context/context";
import { FaTimes } from "react-icons/fa";
import { ModalContainer, CloseModalBtn } from "../theme/theme";

const AddItemForm = (props) => {
  const { showModal, setShowModal } = useGlobalContext();
  return (
    <div className={`modal-overlay ${showModal && "show-modal"}`}>
      <ModalContainer>
        <h3>modal content: {props.category}</h3>
        <CloseModalBtn onClick={() => setShowModal(!showModal)}>
          <FaTimes />
        </CloseModalBtn>
      </ModalContainer>
    </div>
  );
};

export default AddItemForm;
