import InputItem from "./InputItem";
import MainButton from "./MainButton";

const LoginForm = () => {
  const handleSubmit = () => {
    // o username = document.getElementById("username-input");
    /// let result = axios.post("/api/log", {username: o username, password: o passwrd})
    if (result.result === true) {
      // bir yere kaydet username'i Context Api lazım
      // ve diğer ekrana navigate...
    } else {
      // hata mesajını göster
    }
  };

  return (
    <>
      <h2 className="font-light text-2xl mb-8">Login</h2>
      <form>
        <InputItem
          label="Username"
          inputType="text"
          labelFor="username-input"
          errorMessage="This username is incorrect"
        />
        <InputItem
          label="Password"
          inputType="password"
          labelFor="password-input"
          errorMessage="This password is incorrect"
        />
        <MainButton label="Login" onClick={handleSubmit} />
      </form>
    </>
  );
};

export default LoginForm;
