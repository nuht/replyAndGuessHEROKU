import React from "react";

export const UserContext = React.createContext(null);

export function useUserContext() {
    return React.useContext(UserContext);
}