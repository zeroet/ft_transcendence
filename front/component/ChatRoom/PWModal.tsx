import React, { useCallback, useState } from "react";

interface TypeModal {
  setShowPWModal: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
}

export default function PWModal({ setShowPWModal, password }: TypeModal) {
  const [pw, setPw] = useState<string>("");

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPw(e.target.value);
      console.log(password);
    },
    [pw]
  );

  const onClickOk = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (pw === password) {
        setShowPWModal(false);
      }
      setPw("");
    },
    [pw]
  );

  return (
    <div>
      {
        <div className="modal-background">
          <div className="box">
            <div className="title">
              <h2>Password Chat room</h2>
            </div>
            <form>
              <div className="submitform">
                <label>VERIFICATION PASSWORD </label>
                <input type="text" onChange={onChangePassword} value={pw} />
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
