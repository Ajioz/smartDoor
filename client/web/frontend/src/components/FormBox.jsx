import React, { useRef } from "react";
import { Formik, Form } from "formik";
import {
  Wrapper,
  FormWrapper,
  FormHeader,
  ClaimBtn,
  Info,
  Adhoc,
} from "../theme/theme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomInput from "./CustomInput";
import { Link, useNavigate } from "react-router-dom";

const toastParam = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const passkey = {
  username: "Ajiozi",
  password: "sandiewhyte",
};

const initialValues = { username: "", password: "" };

const FormBox = (props) => {
  const initialValuesArray = Object.entries(props.initialValues); //Create an array from the object
  const navigate = useNavigate();
  const toCapital = (str) => str[0].toUpperCase() + str.substring(1);
  const toastId = useRef(null);

  const handleValidation = (obj) => {
    for (let key in obj) {
      let values = obj[key];
      if (values === " ") {
        if (!toast.isActive(toastId.current))
          toastId.current = toast.error(
            "Username and password must not be empty",
            toastParam
          );
      } else {
        if (
          values.password === passkey.password &&
          values.username === passkey.username
        ) {
          if (!toast.isActive(toastId.current))
            toastId.current = toast.success("details match!", toastParam);
          return navigate("/dashboard");
        }
      }
    }
  };

  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
    handleValidation(values);
  };
  return (
    <>
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
                  {props.question} ?{" "}
                  <Adhoc>
                    <Link to={props.url}>{props.action}</Link>
                  </Adhoc>
                </Info>
              </FormWrapper>
            </Form>
          )}
        </Formik>
      </Wrapper>
      <ToastContainer />
    </>
  );
};

export default FormBox;
