import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode";

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
    const res = await postData("user/login", obj, {
      withCredentials: true,
    });
    if (!res.success) {
      toastMsg(res);
    } else {
      if (!hasRun.current) {
        try {
          // Set token in cookie
          const cookieToken = Cookies.get("token");
          if (cookieToken) {
            //this goes active on production
            console.log("Token found in cookie:", cookieToken);
            // Store token in state or local storage for further use (optional)
            // Navigate to a protected route or handle successful authentication
            storeToken(res.token, navigate);
          } else {
            console.log("Cookie not found");
          }
          toast.success(res.message, toastParam);
          hasRun.current = true;
          delay(1000);
          // storeToken(res.token);
          return decodeToken(res.token);
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

export const handleItemSubmit = async (
  action,
  id,
  formData,
  ajiozItem,
  hasRun,
  navigate
) => {
  const res = await ajiozItem(action, id, formData);
  hasRun.current = false;
  if (res && res.status === 201) {
    if (!hasRun.current) {
      toast.success(res.data.message, toastParam);
      hasRun.current = true;
      navigate("/dashboard");
    } else {
      if (!hasRun.current) {
        toast.error(res.message, toastParam);
        hasRun.current = true;
      }
    }
  }
  return res;
};

export const findItem = (array, id) => {
  return array.item.find((name) => name._id === id);
};

export const details = (id, array, navigate) => {
  const singleItem = array.item.filter((item) => item._id === id);
  navigate("/info", { state: { flag: true, singleItem } });
};

// Get a cookie
export const userToken = Cookies.get("token");

// Delete a cookie
export const logout = () => {
  Cookies.remove("token");
};

const storeToken = (token) => {
  localStorage.setItem("lockToken", JSON.stringify(token));
  // return navigate("/dashboard");
};

const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.username;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};
