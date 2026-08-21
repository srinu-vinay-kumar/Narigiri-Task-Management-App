/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect, useContext } from "react";

import API from "../services/api.js";

export const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  loading: "LOADING",
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.loading);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await API.get("/auth/me");
        setUser(response.data.user);
        setApiStatus(apiStatusConstants.success);
      } catch (err) {
        setUser(null);
        setApiStatus(apiStatusConstants.failure);
        console.error(err);
      }
    };
    verifyUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setApiStatus(apiStatusConstants.success);
  };

  const logout = () => {
    setUser(null);
    setApiStatus(apiStatusConstants.initial);
  };

  return (
    <AuthContext.Provider value={{ user, apiStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
