import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import js-cookie

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
    const message = await postData("user/login", obj, {
      withCredentials: true,
    });
    if (!message.success) {
      toastMsg(message);
    } else {
      console.log(message);
      if (!hasRun.current) {
        try {
          // Set token in cookie
          const token = Cookies.get('token');
           if (token) {
             console.log("Token found in cookie:", token);
             // Store token in state or local storage for further use (optional)
             // Navigate to a protected route or handle successful authentication
           } else {
             console.log("Cookie not found (unexpected)");
           }
          toast.success(message.message, toastParam);
          hasRun.current = true;
          // delay(1000);x
          // return navigate("/dashboard", { state: { logout, userToken } });
        } catch (error) {
          console.log(error);
        }
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
    const message = await postData("user/password", newObj);
    if (message.success) {
      if (message.message) {
        toast.success(message.message, toastParam);
        hasRun.current = true;
      }
      return navigate("/", { state: true });
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

// Get a cookie
const userToken = Cookies.get("token");

// Delete a cookie
const logout = () => {
  Cookies.remove("token");
};
