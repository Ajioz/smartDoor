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
  const [email, setEmail] = useState({ email: "", status: false });
  const hasRun = useRef(false);

  const handleSubmit = async (action) => {
    if (action === "Login") {
      navigate("/");
    } else {
      if (email.email === "") {
        setEmail({ ...email, email: "", status: true });
        return;
      }
      const message = await postData("user/email", { email: email.email });
      if (message.message === "confirmed") {
        setEmail({ ...email, email: "", status: false });
        navigate(`/${message.message}`);
      } else {
        if (message === "Check Your Internet Connection!") {
          if (!hasRun.current) {
            toast.error(message, toastParam);
            hasRun.current = true;
            delay(1000);
            setEmail({ ...email, email: "", status: false });
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
      setEmail({ ...email, email: "", status: false });
    });
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
            <Backbtn onClick={() => handleSubmit(props.action)}>
              <FaArrowLeft /> {props.action}
            </Backbtn>
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default Confirmation;
