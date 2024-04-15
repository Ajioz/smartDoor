import React, { useRef } from "react";
import confirmEmail from "../images/confirm_email.jpg";
import { CloseConfirmed2, ContainerEmail, EmailInfo } from "../theme/theme";
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

const EmailConfirmation = ({ recipient, email }) => {
  const { postData } = useGlobalContext();
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const resend = async () => {
    const response = await postData("user/resend", { email });
    if (!hasRun.current) {
      if (response.server === 201) {
        toast.success("Email resent, check your inbox", toastParam);
        hasRun.current = true;
      }
      delay(1000);
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
        <CloseConfirmed2 onClick={() => navigate("/")}>
          <FaTimes />
        </CloseConfirmed2>
        <section className="img">
          <img src={confirmEmail} alt="emailImg" />
        </section>
        <section className="header">
          <h1>Email Confirmation</h1>
          <p>
           Congratulations! {" "}
            {recipient ? recipient : "johnDoe@smardoor.io"} to confirm you are
            real with us, an email was sent to you. After receiving the email, please
            follow the link provided to complete your registration.
          </p>
        </section>
        <section className="send">
          <p>
            If you did not receive any email, please check your spam box, else{" "}
            <span onClick={resend}>Resend confirmation email</span>{" "}
          </p>
        </section>
      </EmailInfo>
    </ContainerEmail>
  );
};

export default EmailConfirmation;
