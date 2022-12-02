import { useContext } from "react";

import { UserContext } from "../context/UserContext";

import InputItem from "../components/InputItem";
import Layout from "../components/Layout";
import MainButton from "../components/MainButton";

function ValidationPage() {

  const { user } = useContext(UserContext);

  return (
    <Layout>
      <div className="md:flex md:flex-row justify-center h-screen">
        <div className="px-16 py-12 md:w-full max-w-lg">
          <h2 className="font-light text-2xl mb-8">Hi {user}</h2>
          <h2 className="font-light text-2xl mb-8">Validate WAX Address</h2>
          <form>
            <InputItem
              label="WAX Address"
              inputType="text"
              labelFor="wax-address-input"
              errorMessage="WAX Address does not match"
            />
            <MainButton label="Validate" />
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ValidationPage;
