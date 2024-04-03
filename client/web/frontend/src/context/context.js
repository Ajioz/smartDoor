import React, { useState, useContext, createContext,  } from 'react'

export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [showSidebar, setShowSidebar] = useState(false)

    return(
         <AppContext.Provider 
            value={{showSidebar, setShowSidebar}}>
                {children}
        </AppContext.Provider>
    )
}

//custom hook
export const useGlobalContext = () => {
    return useContext(AppContext)
}