import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";

import { UserContext } from "../context/UserContext";

import InputItem from "../components/InputItem";
import Layout from "../components/Layout";
import MainButton from "../components/MainButton";

var _link = null;

const BASE_URL = "http://localhost:3500";

function ValidationPage() {
  const { user } = useContext(UserContext);
  const [waxAddress, setWaxAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("init");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!_link) {
      const transport = new AnchorLinkBrowserTransport();
      _link = new AnchorLink({
        transport,
        chains: [
          {
            chainId:
              "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
            nodeUrl: "https://waxtest.eu.eosamsterdam.net"
          }
        ]
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) {
        navigate("/");
      } else {
        const result = await axios.get(
          `${BASE_URL}/api/check-validation?username=${user}`
        );
        if (result.data.result) {
          if (result.data.valid) {
            setWaxAddress(result.data.address);
            setState("already-confirmed");
          } else {
            setState("loaded");
          }
        } else {
          console.log(result.data.error);
        }
      }
    })();
  }, [user]);

  const handleValidate = async () => {
    try {
      setLoading(true);
      const { session } = await _link.login("waxaddressvalidation");
      const address = session.auth.actor.toString();
      const result = await axios.post(`${BASE_URL}/api/validate`, {
        address,
        username: user
      });
      if (result.data.result) {
        const action = {
          account: "dcbawaxvalid",
          name: "validate",
          authorization: [session.auth],
          data: {
            code: result.data.code,
            address
          }
        };
        session.transact({ action }).then(({ transaction }) => {
          navigate("/confirmation");
        });
      } else {
        setErrorMsg(result.data.error);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleInvalidate = async () => {
    const result = await axios.get(
      `${BASE_URL}/api/invalidate?username=${user}`
    );
    if (result.data.result) {
      setWaxAddress("");
      setState("loaded");
    } else {
      setErrorMsg(result.data.error);
    }
  };

  if (state === "init") return null;

  return (
    <Layout>
      <div className="md:flex md:flex-row justify-center h-screen">
        <div className="px-16 py-12 md:w-full max-w-lg">
          <h2 className="font-light text-2xl mb-8">Hi {user}</h2>
          <span className="text-sm text-red">{errorMsg}</span>
          {state === "already-confirmed" && (
            <>
              <div className="flex items-center justify-center border h-9 border-light-gray rounded shadow-md">
                <p className="font-bold">Already Validated</p> <MdDone />
              </div>
              <div className="mt-2">
                <p>
                  Your Address: <b>{waxAddress}</b>
                </p>
                <MainButton label="Invalidate" onClick={handleInvalidate} />
              </div>
            </>
          )}
          {state === "loaded" && (
            <span>
              {loading ? (
                <p>Running...</p>
              ) : (
                <MainButton label="Validate" onClick={handleValidate} />
              )}
            </span>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ValidationPage;
