import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useGlobalContext } from "../context/context";


const initialValues = { email: "", password: "" };
const resetEmail = { email: "" };
const resetPassword = { password: "", confirmPassword: "" };

const Login = () => {
  const { isToken } = useGlobalContext();

  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const hasDecoded = useRef(false);
  const [history, setHistory] = useState({});
  const [reset, setReset] = useState({
    emailReset: false,
    passwordReset: false,
  });

  useEffect(() => {
    if (!hasDecoded.current) {
      const result = decode(location.search.split("=")[1]);
      setHistory({ ...history, result });
      hasDecoded.current = true;
      navigate("/");
      setReset({ ...reset, passwordReset: result?.server });
    }
    state && setReset({ ...reset, passwordReset: !state });
  }, [location.search, history, setHistory, reset, navigate, state]);

  useEffect(() => {
    const { status } = isToken();
    if (status) return navigate("/dashboard");
  }, [isToken, navigate]);

  const decode = (str) => {
    const decodedStr = decodeURIComponent(str);
    if (decodedStr === "undefined") return;
    return JSON.parse(decodedStr);
  };

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
            email={history.result?.email}
            setReset={setReset}
            reset={reset}
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
              <section style={{ margin: "10px auto" }}>
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
            question={"Don't have an account ?"}
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
