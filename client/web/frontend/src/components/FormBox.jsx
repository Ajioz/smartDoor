import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";
import {
  Wrapper,
  FormWrapper,
  FormHeader,
  ClaimBtn,
  Info,
  Adhoc,
} from "../theme/theme";
import CustomInput from "./CustomInput";
import { Link, useNavigate } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import { useGlobalContext } from "../context/context";
import { handleValidation } from "../utils/handler";


const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};


const FormBox = (props) => {
  const navigate = useNavigate();
  const { postData } = useGlobalContext();
  const hasRun = useRef(false);

  const [hasSent, setHasSent] = useState({
    status: false,
    recipient: "",
    email: "",
    password: "",
  });

  const initialValuesArray = Object.entries(props.initialValues); //Create an array from the object
  const toCapital = (str) => str[0].toUpperCase() + str.substring(1);

  const delay = async (time) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };

  const onSubmit = async (values, actions) => {
    try {
      delay(1000);
      hasRun.current = false;
      if (props.email) {
        values.email = props.email;
      }
      const username = await handleValidation(
        values,
        hasRun,
        postData,
        props,
        delay,
        navigate,
        hasSent,
        setHasSent
      );
      actions.resetForm();
      if (username) {
        if (username !== " " && values.password !== " ") {
          try {
            await Auth.signIn(username, values.password);
            // Redirect to dashboard after successful sign-in
            return navigate("/dashboard");
          } catch (error) {
            return toast.error(error.message, toastParam);
          }
        }
      }
    } catch (error) {
      return toast.warning("Service Unreachable, try later!", toastParam);
    }
  };

  return (
    <>
      {hasSent.status ? (
        <EmailConfirmation {...hasSent} />
      ) : (
        <Wrapper>
          <Formik
            initialValues={props.initialValues}
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
                      <Link to={props.url}>{props.action}</Link> | &nbsp;
                      <Link to={"/expired"}>verify email</Link>
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
