import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios"
export const AppContext = createContext();



const url = "http://127.0.1:5002/api/confirm/confirmation";
export const AppProvider = ({ children }) => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [item, setItem] = useState(true);
  const [loading, setLoading] = useState(true);

  const ajiozItem = (obj) => {
    console.log(obj);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}`);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  },[]);

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
        loading
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
