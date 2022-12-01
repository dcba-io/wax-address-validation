import InputItem from "./InputItem";
import MainButton from "./MainButton";

const RegisterForm = () => {
    return (
        <>
            <h2 className="font-light text-2xl mb-8">Register</h2>
            <form>
                <InputItem label="Username" inputType="text" labelFor="username-input" errorMessage="This username is taken" />
                <InputItem label="Password" inputType="password" labelFor="password-input" errorMessage="Incorrect password" />
                <InputItem label="Some Personal Information (Optional)" inputType="text" labelFor="info-input" errorMessage="These credentials do not match" />
                <MainButton label="Register" />
            </form>
        </>
    );

}

export default RegisterForm;