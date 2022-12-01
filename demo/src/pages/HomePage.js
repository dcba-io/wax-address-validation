import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function HomePage() {
  return (
    <Layout>
      <div className="md:flex md:flex-row justify-center divide-x divide-light-gray h-screen">
        <div className="px-16 py-12 md:w-1/2 max-w-lg">
          <RegisterForm />
        </div>
        <div className="px-16 py-12 md:w-1/2 max-w-lg">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
