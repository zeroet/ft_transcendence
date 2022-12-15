import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Error from "../errorAndLoading/Error";
import Loading from "../errorAndLoading/Loading";

export default function TwoFactorModal() {
  const { data, error, mutate } = useSWR(`/api/users`);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value.trim());
      console.log(password);
    },
    [password]
  );

  const onClickOk = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!password) {
        toast.error("Password please", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        // alert("Password please");
        setPassword("");
        return;
      }
      console.log("onClickOk 안의 password값 ", password);
      try {
        await axios.post("/api/two-factor/authenticate", {
          two_factor_code: password,
        });
        updateValide();
      } catch (e) {
        console.log(e);
        toast.error("Wrong Password", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        // alert("Wrong Password");
      }
      setPassword("");
      console.log(password);
    },
    [password, data]
  );

  const updateValide = useCallback(async () => {
    try {
      await axios.post("/api/two-factor/valid", {
        valid: true,
      });
      mutate({ ...data, two_factor_valid: true });
      console.log("유저데이터 valid값 true인지 : ", data.two_factor_valid);
    } catch (e) {
      toast.error("Verification password Error", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: false,
        pauseOnHover: false,
      });
      //   alert("Error for Verification password");
      console.log(e);
    }
  }, []);

  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <div>
      {
        <div className="modal-background">
          <div className="box">
            <div className="title">
              <h2>2Fa Auth</h2>
            </div>
            <form method="post">
              <div className="submitform">
                <label>VERIFICATION PASSWORD</label>
                <input
                  type="text"
                  onChange={onChangePassword}
                  value={password}
                />
                <button onClick={onClickOk} className="ok">
                  ok
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      <style jsx>
        {`
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
           .modal-background {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
          }
          .box{
            position: fixed;
            top: 30%;
            left: 33%;

            width: 500px;
            height: 300px;

            background-color: white;
            border: 1px inset black;
            box-shadow: 10px 10px;
            text-transform: uppercase;
          }
          .title{
            padding-left: 10px;
            background-color: black;
            color: white;
          }
          input {
            // background-color: tomato;
            font-family: "Fragment Mono", monospace;
            width: 400px;
            height: 30px;
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 2px solid black;
            outline: none;
            margin-bottom: 20px;
          }
          .submitform {
            // background-color: yellow;
            padding-left: 50px;
            padding-top: 20px;


        `}
      </style>
    </div>
  );
}
