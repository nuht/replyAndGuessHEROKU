import React from "react";

export const UserContext = React.createContext(null);

export function useUserContext() {
  const context = React.useContext(UserContext);

  if(context === undefined) {
    throw new Error('useUserContext was used outside of its Provider');
  }
    return React.useContext(UserContext);
}
