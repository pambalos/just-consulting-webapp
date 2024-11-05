"use client";

import React, {createContext, useContext} from "react";

export const bgContext = createContext({bgSrc: ""});

export const bgProvider = ({children}: { children: React.ReactNode }) => {

    return (
        <bgContext.Provider value={{bgSrc: ""}}>
            {children}
        </bgContext.Provider>
    );
};

export const useBg = () => {
    return useContext(bgContext);
}