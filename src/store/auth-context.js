import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateTokenExpiration = (expirationTime) => {
  const currentTime = new Date().getTime();
  const calcExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = calcExpirationTime - currentTime;
  return remainingTime;
}

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');//it's either set, or its undefined
  const [token, setToken] = useState(initialToken);

  const isUserLoggedIn = !!token; //returns truthy is there is a token

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);

    const remainingTime = calculateTokenExpiration(expirationTime);
    setTimeout(logoutHandler, remainingTime);
  };

  const contextValue = {
    token: token,
    isLoggedIn: isUserLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;