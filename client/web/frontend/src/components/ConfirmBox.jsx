import React, { useState, useRef } from "react";
import {
  Backbtn,
  CloseConfirmed,
  ContainerEmail,
  EmailInfo,
  Error,
  Input,
} from "../theme/theme";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { handleSubmit } from "../utils/handler";

const Confirmation = (props) => {
  const { postData } = useGlobalContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState({ email: "", status: false });
  const hasRun = useRef(false);

  const submit = (action) => {
    handleSubmit(action, postData, setEmail, email, hasRun, navigate);
  };

  return (
    <>
      <ContainerEmail>
        <EmailInfo height={"65%"}>
          <CloseConfirmed
            onClick={() => navigate("/")}
            top={"9rem"}
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
                  value={email.email}
                  placeholder="verify your email here"
                  onChange={(e) =>
                    setEmail({ ...email, email: e.target.value })
                  }
                  required
                />
                {email.status && email.email.length < 1 && (
                  <Error>This field cannot be empty</Error>
                )}
              </>
            )}
          </section>
          <section className="back">
            <Backbtn onClick={() => submit(props.action)}>
              <FaArrowLeft /> {props.action}
            </Backbtn>
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default Confirmation;
