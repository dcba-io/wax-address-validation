import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { UserContext } from "../context/UserContext";

import InputItem from "./InputItem";
import MainButton from "./MainButton";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [info, setInfo] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("form submitted")

        axios.post("http://localhost:3500/api/register", {
            username,
            password,
            info,
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
                console.log(err.response.data)
            })
    }

    return (
        <>
            <h2 className="font-light text-2xl mb-8">Register</h2>
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

                <InputItem
                    label="Some Personal Information (Optional)"
                    inputType="text"
                    labelFor="info"
                    value={info}
                    onChange={(e) => {
                        setInfo(e.target.value)
                    }}
                />
                <MainButton label="Register" linkTo="/validation" />
            </form>
        </>
    );
}

export default RegisterForm;