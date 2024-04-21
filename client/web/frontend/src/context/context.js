import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const AppContext = createContext();

const base_url = "http://127.0.1:5002/api";

export const AppProvider = ({ children }) => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(true);
  const [item, setItem] = useState(true);
  const [loading, setLoading] = useState(false);

  const doors = (obj) => {
    console.log(obj);
  };

  const isToken = () => {
    const token = JSON.parse(localStorage.getItem("token")); // Assuming you're using js-cookie
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
      const now = Date.now();
      if (now > expirationTime) {
        console.log("Token likely expired (client-side check).");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const fetchData = useCallback(async (token) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${token}`,
      },
    };
    setLoading(true);
    try {
      const { data } = await axios.get(`${base_url}/thing`, config);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppContext.Provider
      value={{
        showSidebar,
        status,
        item,
        showModal,
        doors,
        setShowModal,
        setShowSidebar,
        setStatus,
        setItem,
        loading,
        postData,
        isToken,
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
