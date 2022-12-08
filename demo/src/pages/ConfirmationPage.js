import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";

import { UserContext } from "../context/UserContext";

import Layout from "../components/Layout";

function ConfirmationPage() {
  const { user } = useContext(UserContext);
  const [state, setState] = useState("init");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setState("loaded");
    }
  }, [user]);

  if (state === "init") return null;

  return (
    <Layout>
      <div className="md:flex md:flex-row justify-center h-screen">
        <div className="px-16 py-12 md:w-full max-w-lg">
          <h2 className="font-light text-2xl mb-8">Validate WAX Address</h2>
          <div className="flex items-center justify-center border h-9 border-light-gray rounded shadow-md">
            <p className="font-bold">Validation Done</p> <MdDone />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ConfirmationPage;
