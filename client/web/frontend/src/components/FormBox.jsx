import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import {
  Wrapper,
  FormWrapper,
  FormHeader,
  ClaimBtn,
  Info,
  Adhoc,
} from "../theme/theme";
import { toast } from "react-toastify";
import CustomInput from "./CustomInput";
import { Link, useNavigate } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import { useGlobalContext } from "../context/context";

const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const passkey = {
  username: "Ajiozi",
  password: "sandiewhyte",
};

const initialValues = { username: "", password: "" };

const FormBox = (props) => {
  const navigate = useNavigate();
  const { postData } = useGlobalContext();
  const hasRun = useRef(false);
  const [hasSent, setHasSent] = useState({
    status: false,
    recipient: "",
    email: "",
  });

  const initialValuesArray = Object.entries(props.initialValues); //Create an array from the object
  const toCapital = (str) => str[0].toUpperCase() + str.substring(1);

  const handleValidation = async (obj) => {
    if (props.btn === "LOGIN") {
      if (
        obj.password !== passkey.password ||
        obj.username !== passkey.username
      ) {
        if (!hasRun.current) {
          toast.error("Incorrect login details", toastParam);
          hasRun.current = true;
        }
      } else if (
        obj.password === passkey.password &&
        obj.username === passkey.username
      ) {
        if (!hasRun.current) {
          toast.success("Details match!", toastParam);
          hasRun.current = true;
          delay(1000);
          return navigate("/dashboard");
        }
      }
    } else {
      const message = await postData("user/signup", obj);
      if (
        message.server === 535 ||
        message.server === "" ||
        message.server === undefined
      ) {
        if (!hasRun.current) {
          toast.error(message.message, toastParam);
          hasRun.current = true;
        }
      } else {
        if (message.message) {
          toast.success(message.message, toastParam);
          hasRun.current = true;
          setHasSent({
            ...hasSent,
            status: true,
            recipient: message.recipient,
            email: obj.email,
          });
        }
      }
    }
  };

  const delay = async (time) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };

  const onSubmit = (values, actions) => {
    delay(1000);
    hasRun.current = false;
    handleValidation(values);
    actions.resetForm();
  };

  return (
    <>
      {hasSent.status ? (
        <EmailConfirmation {...hasSent} />
      ) : (
        <Wrapper>
          <Formik
            initialValues={initialValues}
            validationSchema={props.schema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormWrapper>
                  <FormHeader>
                    <h3>{props.title}</h3>
                  </FormHeader>
                  {initialValuesArray.map((item, index) => {
                    const item_rebirth = String(item).split(",")[0];
                    return (
                      <CustomInput
                        id={item_rebirth}
                        key={index}
                        label={toCapital(item_rebirth)}
                        name={item_rebirth}
                        type={item_rebirth === "password" ? "password" : "text"}
                        placeholder={`${item_rebirth}`}
                      />
                    );
                  })}
                  <ClaimBtn disabled={isSubmitting} type="submit">
                    {props.btn}
                  </ClaimBtn>
                  <Info>
                    {props.question}{" "}
                    <Adhoc>
                      <Link to={props.url}>{props.action}</Link>
                    </Adhoc>
                  </Info>
                </FormWrapper>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  );
};

export default FormBox;
