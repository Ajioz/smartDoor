import React, { useState, useContext, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [item, setItem] = useState(true);

  const ajiozItem = (obj) => {
    console.log(obj);
  };

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
