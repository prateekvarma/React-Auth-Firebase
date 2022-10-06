import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

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

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateTokenExpiration(storedExpirationTime);

    if (remainingTime <= 60000) {
      //if remainingTime is less than 1 minute, remove login token
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      return null;
    }

    return {
      token: storedToken,
      duration: remainingTime
    };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  } //otherwise initialToken stays undefined

  const [token, setToken] = useState(initialToken);

  const isUserLoggedIn = !!token; //returns truthy is there is a token

  const logoutHandler = useCallback (() => {
    setToken(null);
    localStorage.removeItem('token');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateTokenExpiration(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    //if stored token is there, set a timeout for the remaining time - this is called for auto login
    if(tokenData) {
      console.log(tokenData.duration)
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

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