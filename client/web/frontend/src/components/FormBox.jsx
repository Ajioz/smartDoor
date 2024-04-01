import React from "react";
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
import { Link } from "react-router-dom";

const onSubmit = async (values, actions) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
  console.log(values);
};

const initialValues = { username: "", password: "" };
const FormBox = (props) => {
  const initialValuesArray = Object.entries(props.initialValues); //Create an array from the object
  const toCapital = (str) => str[0].toUpperCase() + str.substring(1);

  return (
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
  );
};

export default FormBox;
