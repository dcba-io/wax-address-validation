import InputItem from "./InputItem";
import MainButton from "./MainButton";

const LoginForm = () => {
    return (
        <>
            <h2 className="font-light text-2xl mb-8">Login</h2>
            <form>

                <InputItem label="Username" inputType="text" labelFor="username-input" errorMessage="This username is incorrect" />
                <InputItem label="Password" inputType="password" labelFor="password-input" errorMessage="This password is incorrect" />
                <MainButton label="Login" />
            </form>
        </>
    );

}

export default LoginForm;