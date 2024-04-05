import React, { useState, useContext, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [status, setStatus] = useState(false);
  const [item, setItem] = useState(false);

  return (
    <AppContext.Provider
      value={{
        showSidebar,
        status,
        item,
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
