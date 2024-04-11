import React, { useState } from "react";
import FormBox from "../components/FormBox";
import Greeting from "../components/Greeting";
import { FaArrowLeft } from "react-icons/fa";
import {
  Container,
  QuickInfo,
  ContentWrapper,
  ClaimBtn,
  Backbtn,
} from "../theme/theme";
import { loginSchema, resetSchema, resetPasswordSchema } from "../schemas";
import bgImg from "../images/bg-intro-desktop.png";

const initialValues = { username: "", password: "" };
const resetEmail = { email: "" };
const resetPassword = { "New Password": "", "Verify Password": "" };

const Login = () => {
  const [reset, setReset] = useState({
    emailReset: false,
    passwordReset: false,
  });
  const resetForm = (props) => {
    setReset({ ...reset, emailReset: props });
  };
  return (
    <Container background="#006064" imageurl={bgImg}>
      {reset.passwordReset ? (
        <>
          <QuickInfo>
            <ContentWrapper>
              <h1>Forgot Password ?</h1>
              <p>You Can reset your password using this form</p>
            </ContentWrapper>
          </QuickInfo>
          <FormBox
            title={<Greeting />}
            schema={resetPasswordSchema}
            btn={"Reset My Password"}
            initialValues={resetPassword}
          />
        </>
      ) : reset.emailReset ? (
        <>
          <QuickInfo>
            <ContentWrapper>
              <p>
                To reset your password, enter the registered email address and
                we will send you password reset instructions on your e-mail
              </p>
              <section>
                <Backbtn onClick={() => resetForm(false)}>
                  <FaArrowLeft /> Back
                </Backbtn>
              </section>
            </ContentWrapper>
          </QuickInfo>
          <FormBox
            title={"Forgot Your Password?"}
            schema={resetSchema}
            btn={"Reset Password"}
            initialValues={resetEmail}
          />
        </>
      ) : (
        <>
          <QuickInfo>
            <ContentWrapper>
              <h1>Welcome Back</h1>
              <p>
                Security represents a collaborative effort between Ajiozi and
                you. We are glad to be your trusted partner to securing your
                home
                <cite title="https://ajiozi.com"> - Ajiozi</cite>
              </p>
              <section>
                <ClaimBtn onClick={() => resetForm(true)}>
                  Reset Password
                </ClaimBtn>
              </section>
            </ContentWrapper>
          </QuickInfo>
          <FormBox
            title={<Greeting />}
            schema={loginSchema}
            btn={"LOGIN"}
            question={"Don'T have an account ?"}
            action={"Register Here"}
            url={"/register"}
            initialValues={initialValues}
          />
        </>
      )}
    </Container>
  );
};

export default Login;
