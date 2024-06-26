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
import CustomInput from "./CustomInput";
import { Link, useNavigate } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import { useGlobalContext } from "../context/context";
import { handleValidation } from "../utils/handler";

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

  const delay = async (time) => {
    await new Promise((resolve) => setTimeout(resolve, time));
  };

  const onSubmit = (values, actions) => {
    delay(1000);
    hasRun.current = false;
    if (props.email) {
      values.email = props.email;
    }
    handleValidation(
      values,
      hasRun,
      postData,
      props,
      delay,
      navigate,
      hasSent,
      setHasSent,
    );
    actions.resetForm();
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
