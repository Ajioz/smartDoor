import React, { useRef } from "react";
import confirmEmail from "../images/confirm_email.jpg";
import { CloseConfirmed, ContainerEmail, EmailInfo } from "../theme/theme";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/context";


const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const EmailConfirmation = ({ recipient }) => {
  const { postData } = useGlobalContext();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const resend = () => {
    console.log("Resend confirmation email");
    if (!hasRun.current) {
      toast.success("Email resent, check your inbox", toastParam);
      hasRun.current = true;
      delay(1000);
      postData();
    }
  };

  const delay = async (time) => {
    await new Promise((resolve) => {
      setTimeout(resolve, time);
      hasRun.current = false;
    });
  };

  return (
    <ContainerEmail>
      <EmailInfo>
        <CloseConfirmed onClick={() => navigate("/")} >
          <FaTimes />
        </CloseConfirmed>
        <section className="img">
          <img src={confirmEmail} alt="emailImg" />
        </section>
        <section className="header">
          <h1>Email Confirmation</h1>
          <p>
            We have sent email to{" "}
            {recipient ? recipient : "johnDoe@smardoor.io"} to
            confirm the validity of your email address. After receiving the
            email follow the link provided to complete your registration.
          </p>
        </section>
        <section className="send">
          <p>
            If you did not receive any email, please your spam box, else{" "}
            <span onClick={resend}>Resend confirmation email</span>{" "}
          </p>
        </section>
      </EmailInfo>
    </ContainerEmail>
  );
};

export default EmailConfirmation;
