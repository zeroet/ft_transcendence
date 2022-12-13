import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

interface TypeModal {
  setShowPWModal: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
}

export default function PWModal({ setShowPWModal, roomId }: TypeModal) {
  const [pw, setPw] = useState<string>("");
  const router = useRouter();

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPw(e.target.value);
    },
    [pw]
  );

  const onClickOk = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const result = await axios
        .post(`/api/chatroom/${roomId}/password`, {
          password: pw,
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (result === true) {
        setShowPWModal(false);
      }
      setPw("");
    },
    [pw, roomId]
  );

  const cancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.back();
  };

  return (
    <div>
      {
        <div>
          <div className="box">
            <div className="title">
              <h2>Private Chat room</h2>
            </div>
            <form>
              <div className="submitform">
                <div className="labelDiv">
                  <label>VERIFICATION PASSWORD </label>
                  <input
                    type="password"
                    onChange={onChangePassword}
                    value={pw}
                    autoFocus
                  />
                </div>
                <div className="buttonDiv">
                  <button onClick={onClickOk} className="ok">
                    ok
                  </button>
                  <button onClick={cancel} className="cancel">
                    cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
      <style jsx>
        {`
          .labelDiv {
            // background-color: yellow;
            padding-top: 30px;
            padding-left: 50px;
            // text-align: center;
          }
          .buttonDiv {
            // background-color: red;
            text-align: center;
            padding-top: 10px;
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
          .box {
            position: fixed;
            top: 30%;
            left: 33%;

            width: 500px;
            height: 250px;

            background-color: white;
            border: 1px inset black;
            box-shadow: 10px 10px;
            text-transform: uppercase;
          }
          .title {
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
            // padding-left: 50px;
            // padding-top: 20px;
          }
          .cancel {
            font-family: "Fragment Mono", monospace;
            font-size: 20px;
            padding: 10px 20px;
            border: 1px solid black;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}
