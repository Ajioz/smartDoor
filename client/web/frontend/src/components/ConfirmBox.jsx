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
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { handleSubmit } from "../utils/handler";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";

const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const Confirmation = (props) => {
  const { postData } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState({ email: "", status: false });
  const [code, setCode] = useState("");
  const hasRun = useRef(false);

  const submit = (action) => {
    handleSubmit(action, postData, setEmail, email, hasRun, navigate);
  };

  const decode = (str) => {
    const decodedStr = decodeURIComponent(str);
    if (decodedStr === "undefined") return;
    return JSON.parse(decodedStr);
  };

  const confirmHandler = async () => {
    try {
      const { email: emailBox, username } = decode(location.search.split("=")[1]);
      const res = await Auth.confirmSignUp(username, code);
      console.log(res);
      if (res.message === "SUCCESS") {
        const { data } = await postData("user/verify", { email: emailBox });  //The essence of this email thing is to prevent email name conflict, since 'email' as a name is already being managed by a state
        if (data.status) {
          toast.success(res, toastParam);
          return navigate("/");
        }
      } else {
         toast.warning("This user doesn't exist", toastParam);
      }
      return toast.error("Couldn't confirm user", toastParam);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
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
              <>
                <Input
                  type="text  "
                  value={code}
                  placeholder="Enter code"
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <section className="back">
                  <Backbtn onClick={confirmHandler}>
                    &nbsp;{props.action}
                  </Backbtn>
                </section>
              </>
            ) : (
              <>
                <img src={props.img} alt="emailBox" />
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
                <section className="back">
                  <Backbtn onClick={() => submit(props.action)}>
                    <FaArrowLeft /> {props.action}
                  </Backbtn>
                </section>
              </>
            )}
          </section>
        </EmailInfo>
      </ContainerEmail>
    </>
  );
};

export default Confirmation;
