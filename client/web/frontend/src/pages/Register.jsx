import React from "react";
import FormBox from "../components/FormBox";
import { Container, QuickInfo, ContentWrapper } from "../theme/theme";
import { registerSchema } from "../schemas";

const initialValues = {
  Name: "",
  Username: "",
  Email: "",
  Password: "",
  confirmPassword: "",
};

const Register = () => {
  return (
    <Container background="#009688">
      <QuickInfo>
        <ContentWrapper>
          <h1>IoT Door Security</h1>
          <p>
            Experienced the power of innovation. This changes the way modern
            doors are secured and operated. The art of modern technology, simply
            powered by <cite title="https://ajiozi.com">Ajiozi</cite>
          </p>
        </ContentWrapper>
      </QuickInfo>
      <FormBox
        title={"Glad to Know You"}
        btn={"CREATE ACCOUNT"}
        schema={registerSchema}
        initialValues={initialValues}
        question={"Have an account"}
        action={"Login"}
        url={"/login"}
      />
    </Container>
  );
};

export default Register;
