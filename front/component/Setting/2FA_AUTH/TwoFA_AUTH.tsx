import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const TwoFA_AUTH = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const router = useRouter();
  const { data, error } = useSWR("/api/users");
  //   console.log(data);
  // state필요없고, get으로 데이터 넣고, post로 업데이트해야한다.
  // const [twoFactor, settwoFactor] = useState(false);
  const [codeFromQRCode, setCodeFromQRCode] = useState<string>("");

  const onChangeCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCodeFromQRCode(e.target.value);
      console.log("code form", codeFromQRCode);
    },
    [codeFromQRCode]
  );

  const changeTwoFactorValidToTrue = useCallback(async () => {
    try {
      await axios.post("/api/two-factor/valid", { valid: true });
      await mutate("/api/users");
    } catch (e) {
      console.log(e);
    }
  }, []);

  // console.log(data.two_factor);
  const onClick2FA = useCallback(
    async (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("code qr", codeFromQRCode);
      if (data) {
        if (!data.two_factor_activated) {
          try {
            await axios.post("/api/two-factor/activate", {
              set: true,
              two_factor_code: codeFromQRCode,
            });
            setCodeFromQRCode("");
            console.log(data.two_factor_valid, "is valid valuie");
            await changeTwoFactorValidToTrue();
            modal(e);
            router.push("/Home");
          } catch (e) {
            console.log(e);
            toast.error("Wrong code", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              rtl: false,
              pauseOnFocusLoss: true,
              draggable: false,
              pauseOnHover: false,
            });
            // alert("Wrong code");
          }
        } else if (data.two_factor_activated) {
          try {
            await axios.post("/api/two-factor/deactivate", {
              set: false,
            });
            await mutate("/api/users");
            modal(e);
            router.push("/Home");
          } catch (e) {
            console.log(e);
          } finally {
            setCodeFromQRCode("");
          }
        }
      }
    },
    [codeFromQRCode]
  );

  if (data) {
    console.log(data.two_factor_activated);
  }

  // console.log(data.two_factor_activated);
  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>2FA Auth</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          {data.two_factor_activated === true ? (
            <div className="activated">
              <img src="/favicon.ico" width={70} height={70} />
              <div className="is-active">ACTIVATED</div>
            </div>
          ) : (
            <div>
              <img alt={data} src={"/api/two-factor/generate"} />
              <input
                className="contexte"
                onChange={onChangeCode}
                placeholder="Code please (6 numbers)"
                type="text"
                value={codeFromQRCode}
                autoFocus
              />
            </div>
          )}
        </div>
        <div className="buttonDiv">
          <button onClick={onClick2FA} className="ok">
            {data.two_factor_activated === false ? "ACTIVATE" : "DEACTIVATE"}
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      {/* <ToastContainer
        style={{ width: "300px", textAlign: "center", fontSize: "15px" }}
        toastStyle={{
          textTransform: "none",
        }}
      /> */}
      <style jsx>{`
        .activated {
          padding-top: 50px;
          width: 200px;
          height: 180px;
        }
        .is-active {
          color: black;
          font-family: "Doppio One";
          font-style: normal;
          font-weight: 400;
          font-size: 30px;
          line-height: 20px;
          overflow: visible;
          margin: 5px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 15%;
          left: 39.5%;
          width: 400px;
          height: 500px;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
          // height: 100%;
        }
        .submitform {
          margin: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input {
          // background-color: tomato;
          font-family: "Fragment Mono", monospace;
          width: 200px;
          height: 30px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 2px solid black;
          outline: none;
          margin-bottom: 20px;
          margin-top: 10px;
        }
        input::placeholder {
          text-align: center;
          color: red;
        }
        button {
          text-align: center;
          padding-top: 20px;
        }
        .contexte {
          text-align: center;
        }
        .buttonDiv {
          // background-color: yellow;
          margin-top: 10px;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default TwoFA_AUTH;
