import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from "react";

import { UserContext } from "../context/UserContext";

import InputItem from "./InputItem";
import MainButton from "./MainButton";

const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form submitted")

    axios.post("http://localhost:3500/api/login", {
      username,
      password,
    }).then((response) => {
      console.log(response.data)
      if (!response.data.result) {
        setErrorMsg(response.data.error);
      } else {
        setUser(username);
        navigate("/validation");
      }
    })
      .catch((err) => {
        console.log(err)
        console.log(err.response)
      })
  }

  // o username = document.getElementById("username-input");
  /// let result = axios.post("/api/log", {username: o username, password: o passwrd})

  //if (result.result === true) {
  // bir yere kaydet username'i Context Api lazım
  // ve diğer ekrana navigate...
  //} else {
  // hata mesajını göster
  //}

  return (
    <>
      <h2 className="font-light text-2xl mb-8">Login</h2>
      <span className="text-sm text-red">{errorMsg}</span>
      <form onSubmit={handleSubmit}>
        <InputItem
          label="Username"
          inputType="text"
          labelFor="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />
        <InputItem
          label="Password"
          inputType="text"
          labelFor="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <MainButton label="Login" />
      </form>
    </>
  );
};

export default LoginForm;
