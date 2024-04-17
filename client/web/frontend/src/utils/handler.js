import { toast } from "react-toastify";

const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const handleSubmit = async (
  action,
  postData,
  setEmail,
  email,
  hasRun,
  navigate
) => {
  const delay = async (time) => {
    await new Promise((resolve) => {
      setTimeout(resolve, time);
      hasRun.current = false;
      setEmail({ ...email, email: "", status: false });
    });
  };

  if (action === "Login") {
    navigate("/");
  } else if (action === "Send") {
    if (email.email === "") {
      setEmail({ ...email, email: "", status: true });
      return;
    }
    const message = await postData("user/resend", { email: email.email });
    if (message.server === 201) {
      if (!hasRun.current) {
        toast.success(message.message, toastParam);
        hasRun.current = true;
        delay(1000);
        setEmail({ ...email, email: "", status: false });
        navigate("/");
      }
    } else {
      if (!hasRun.current) {
        toast.error(message.message, toastParam);
        hasRun.current = true;
        delay(1000);
        setEmail({ ...email, email: "", status: false });
      }
    }
  } else {
    if (email.email === "") {
      setEmail({ ...email, email: "", status: true });
      return;
    }
    const message = await postData("user/email", { email: email.email });
    if (message.message === "confirmed") {
      setEmail({ ...email, email: "", status: false });
      navigate(`/${message.message}`);
    } else {
      if (message === "Check Your Internet Connection!") {
        if (!hasRun.current) {
          toast.error(message, toastParam);
          hasRun.current = true;
          delay(1000);
          setEmail({ ...email, email: "", status: false });
        }
      } else {
        if (!hasRun.current) {
          toast.success("Email resent, check your inbox", toastParam);
          hasRun.current = true;
          delay(1000);
        } else {
        }
      }
    }
  }
};

export const handleValidation = async (
  obj,
  hasRun,
  postData,
  props,
  delay,
  navigate,
  hasSent,
  setHasSent
) => {
  const toastMsg = (message) => {
    if (!hasRun.current) {
      toast.error(message.message, toastParam);
      hasRun.current = true;
    }
  };
  if (props.btn === "LOGIN") {
    const message = await postData("user/login", obj);
    if (!message.success) {
      toastMsg(message);
    } else {
      if (!hasRun.current) {
        toast.success(message.message, toastParam);
        hasRun.current = true;
        delay(1000);
        return navigate("/dashboard");
      }
    }
  } else if (props.btn === "Reset Password") {
    const newObj = { ...obj, info: "reset" };
    const message = await postData("user/resend", newObj);
    if (message.server === 201) {
      if (message.message) {
        toast.success(message.message, toastParam);
        hasRun.current = true;
      }
    } else {
      toastMsg(message);
    }
  } else if (props.btn === "Reset My Password") {
    const newObj = { ...obj, confirmPassword: undefined };
    console.log(obj);
    const message = await postData("user/password", newObj);
    // console.log(message);
    if (message.server === 201) {
      if (message.message) {
        toast.success(message.message, toastParam);
        hasRun.current = true;
      }
    } else {
      toastMsg(message);
    }
  } else {
    const message = await postData("user/signup", obj);
    if (
      message.server === 535 ||
      message.server === "" ||
      message.server === undefined
    ) {
      toastMsg(message);
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
