import React, { createContext, useContext } from "react";

export const AlertsContext = createContext({
  alerts: [],
  loading: false,
  // You can add methods here e.g. setAlerts, setLoading
});

export const AlertsProvider = ({ children }) => {
  const value = { alerts: [], loading: false };
  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  );
};

// Optional custom hook
export const useAlerts = () => useContext(AlertsContext);
