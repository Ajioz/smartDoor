import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const AppContext = createContext();

const base_url = "http://127.0.1:5002/api";

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [control, setControl] = useState({
    status: false,
    item: [],
    loading: false,
  });

  const ajiozItem = async (action, id, obj) => {
    const { token } = isToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${token}`,
      },
    };
    try {
      let response;
      if (action === "CREATE") {
        response = await axios.post(`${base_url}/thing`, obj, config);
      } else if (action === "EDIT") {
        response = await axios.patch(`${base_url}/thing/${id}`, obj, config);
      } else if (action === "DELETE") {
        response = await axios.delete(`${base_url}/thing/${id}`, config);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating data", error.response);
        return error.response;
      }
      if (error.response && error.response.status === 401) {
        return error.response;
      } else {
        console.error("Unexpected error:", error.response);
      }
    }
  };

  const isToken = () => {
    const token = JSON.parse(localStorage.getItem("token")) || "";
    // console.log(token);
    if (token === "") return { status: false, token };
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
      const now = Date.now();
      if (now > expirationTime) {
        console.log("Token likely expired (client-side check).");
        localStorage.removeItem("token");
        return { status: false, token: "expired" };
      } else {
        return { status: true, token };
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return { status: false, error };
    }
  };

  const fetchData = useCallback(
    async (token) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${token}`,
        },
      };
      setControl({ ...control, loading: true });
      try {
        const response = await axios.get(`${base_url}/thing`, config);
        if (response?.data?.thing.length > 0)
        setControl({
          ...control,
          loading: false,
          item: [...response.data.thing],
          status: false,
        });
      } catch (error) {
        console.log(error);
        setControl({ ...control, loading: false, item: [] });
      }
    },
    [control]
  );


  const postData = async (route, body) => {
    try {
      const response = await axios.post(`${base_url}/${route}`, body);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "Error fetching user data:",
          error.response.data.message || "No such user in database"
        );
        return error.response.data;
      }
      if (error.response && error.response.status === 401) {
        return error.response.data;
      } else {
        console.error("Unexpected error:", error.response.data.message);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        showSidebar,
        showModal,
        setShowModal,
        setShowSidebar,
        postData,
        isToken,
        control,
        ajiozItem,
        fetchData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

//custom hook
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export const CookieTokenManager = () => {
  // Check if token exists in local storage
  const token = Cookies.get("token");
  if (token) {
    // Get expiration date from token if available
    const tokenExpires = Cookies.get("token_expires");
    if (tokenExpires) {
      const expirationDate = new Date(tokenExpires);
      // Check if token has expired
      if (expirationDate <= new Date()) {
        // Token has expired, remove it from local storage
        Cookies.remove("token");
        Cookies.remove("token_expires");
        // You can also perform additional actions here if needed
        console.log("Expired token has been removed");
      }
    }
  }
};
