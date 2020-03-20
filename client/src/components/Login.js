import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

export const LoginForm = props => {
  const [userInfo, setUserInfo] = useState({
    credentials: {
      username: "",
      password: ""
    }
  });

  const login = event => {
    event.preventDefault();
    axiosWithAuth()
      .post("/login", userInfo.credentials)
      .then(res => {
        console.log("this is in the Login component, login", res);
        localStorage.setItem("token", res.data.payload);
        props.history.push("/BubblePage");
      })
      .catch(err => {
        console.log("ERROR", err);
      });
  };

  const handleChange = event => {
    setUserInfo({
      credentials: {
        ...userInfo.credentials,
        [event.target.name]: event.target.value
      }
    });
  };
  return (
    <>
      <h1>Welcome to the Bubble App!</h1>
      <p>Build a login page here</p>
      <form onSubmit={login} className="main-form">
        <input
          className="login-input"
          type="text"
          value={userInfo.credentials.userName}
          name="username"
          placeholder="User Name"
          onChange={handleChange}
        />
        <input
          className="password-input"
          type="password"
          value={userInfo.credentials.password}
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button>Log In</button>
      </form>
    </>
  );
};

export default LoginForm;
