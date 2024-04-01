import React from "react";
import FormBox from "../components/FormBox";
import Greeting from "../components/Greeting";
import { Container, QuickInfo, ContentWrapper } from "../theme/theme";
import { loginSchema } from "../schemas";

const initialValues = { username: "", password: "" };

const Login = () => {
  return (
    <Container background="#006064">
      <QuickInfo>
        <ContentWrapper>
          <h1>Welcome Back</h1>
          <p>
            Security represents a collaborative effort between Ajiozi and you.
            We are glad to be your trusted partner to securing your home
            <cite title="https://ajiozi.com"> - Ajiozi</cite>
          </p>
        </ContentWrapper>
      </QuickInfo>
      <FormBox
        title={<Greeting />}
        schema={loginSchema}
        btn={"LOGIN"}
        question={"Don'T have an account"}
        action={"Register Here"}
        url={"/register"}
        initialValues={initialValues}
      />
    </Container>
  );
};

export default Login;
