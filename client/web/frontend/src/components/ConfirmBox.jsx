import React, { useState, useRef } from "react";
import {
  Backbtn,
  CloseConfirmed,
  ContainerEmail,
  EmailInfo,
  Input,
} from "../theme/theme";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { toast } from "react-toastify";

const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const Confirmation = (props) => {
  const { postData } = useGlobalContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const hasRun = useRef(false);

  const handleSubmit = async (action) => {
    if (action === "Login") {
      navigate("/");
    } else {
      const message = await postData("user/email", email);
      // console.log(message)
      if (message.message === "confirmed") {
        setEmail("");
        navigate(`/${message.message}`);
      } else {
        if (message === "Authentication Server failed") {
          if (!hasRun.current) {
            toast.error(message, toastParam);
            hasRun.current = true;
            delay(1000);
            setEmail("");
          }
        } else {
          if (!hasRun.current) {
            toast.success("Email resent, check your inbox", toastParam);
            hasRun.current = true;
            delay(1000);
          } else {
          }
        }
      }
    }
  };

  const delay = async (time) => {
    await new Promise((resolve) => {
      setTimeout(resolve, time);
      hasRun.current = false;
    });
  };

  return (
    <>
      <ContainerEmail>
        <EmailInfo height={"65%"}>
          <CloseConfirmed
            onClick={() => navigate("/")}
            top={"12rem"}
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
                  value={email}
                  placeholder="verify your email here"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}
          </section>
          <section className="back">
            <Backbtn onClick={handleSubmit(props.action)}>
              <FaArrowLeft /> {props.action}
            </Backbtn>
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default Confirmation;
