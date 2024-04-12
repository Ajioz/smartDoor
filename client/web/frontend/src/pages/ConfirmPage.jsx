import React from "react";
import {
  Backbtn,
  CloseConfirmed,
  ContainerEmail,
  EmailInfo,
} from "../theme/theme";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import email from "../images/confirmed.jpg";
import tick from "../images/tick.gif";

const ConfirmPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <ContainerEmail>
        <EmailInfo>
          <CloseConfirmed onClick={() => navigate("/")}>
            <FaTimes />
          </CloseConfirmed>
          <h3>Email Confirmed!</h3>
          <section className="tick">
            <img src={tick} alt="tick" />
          </section>
          <section>
            <Backbtn onClick={() => navigate("/")}>
              <FaArrowLeft /> Back
            </Backbtn>
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default ConfirmPage;
