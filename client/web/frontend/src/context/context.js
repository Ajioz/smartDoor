import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
export const AppContext = createContext();

const base_url = "http://127.0.1:5002/api";

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(true);
  const [item, setItem] = useState(true);
  const [loading, setLoading] = useState(true);

  const ajiozItem = (obj) => {
    console.log(obj);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // const { data } = await axios.get(`${base_url}/status`);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const postData = async (route, body) => {
    try {
      const response = await axios.post(`${base_url}/${route}`, body);
      // console.log(response)
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "Error fetching user data:",
          error.response.data.message || "No such user in database"
        );
        return error.response.data;
      } if (error.response && error.response.status === 401) {
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
        ajiozItem,
        setShowModal,
        setShowSidebar,
        setStatus,
        setItem,
        loading,
        postData,
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
