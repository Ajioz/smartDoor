import React from "react";
import {
  Backbtn,
  CloseConfirmed,
  ContainerEmail,
  EmailInfo,
  Input,
} from "../theme/theme";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Confirmation = (props) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Submitted");
  };
  return (
    <>
      <ContainerEmail>
        <EmailInfo height={"40%"}>
          <CloseConfirmed
            onClick={() => navigate("/")}
            top={"13rem"}
            right={"26.5rem"}
          >
            <FaTimes />
          </CloseConfirmed>
          <h3>{props.msg}</h3>
          <section className="tick">
            {props.imgType ? (
              <img src={props.img} alt="tick" />
            ) : (
              <>
                <img src={props.img} alt="tick" />
                <Input
                  type="email"
                  placeholder="enter your email here"
                  onClick={handleSubmit}
                />
              </>
            )}
          </section>
          <section className="back">
            <Backbtn onClick={() => navigate("/")}>
              <FaArrowLeft /> {props.action}
            </Backbtn>
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default Confirmation;