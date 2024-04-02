import React, { useState, useContext, createContext,  } from 'react'

export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [showModal, setShowModal] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    return(
         <AppContext.Provider 
            value={{showModal, setShowModal, showSidebar, setShowSidebar}}>
                {children}
        </AppContext.Provider>
    )
}

//custom hook
export const useGlobalContext = () => {
    return useContext(AppContext)
}