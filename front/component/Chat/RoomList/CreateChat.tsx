import { useState, useEffect } from "react";

export default function CreateChat() {
  let [modalBox, setModalBox] = useState<boolean>(true);
  //   useEffect(() => {
  //     const width = window.outerWidth / 2;
  //     const heigth = window.outerHeight / 2;
  //   }, []);
  const createRoom = () => {
    alert("hi");
  };

  const cancelRoom = () => {
    alert("cancel");
  };

  return (
    <div className="box">
      <div className="title">
        <h2>Create Chat Room</h2>
      </div>
      <h4>name</h4>
      <form className="nameForm">
        <input className="input" type="text"></input>
      </form>
      <h4>password</h4>
      <form>
        <input
          className="input"
          type="password"
          placeholder="for private room"
        ></input>
      </form>
      <div className="button">
        <button onClick={createRoom} className="ok">
          OK
        </button>
        <button onClick={cancelRoom} className="cancel">
          Cancel
        </button>
      </div>
      <style jsx>{`
        .box {
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          // background-color: rgba(0, 0, 0, 0.4);
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
        h4 {
          padding-left: 50px;
        }
        form {
          // background-color: yellow;
          padding-left: 50px;
          margin-top: -20px;
        }
        .input {
          // background-color: tomato;
          font-family: "Fragment Mono", monospace;
          width: 400px;
          height: 30px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 2px solid black;
          outline: none;
        }
        .input::placeholder {
          color: red;
        }
        .button {
          // background-color: yellow;
          width: 100%;
          text-align: center;
          padding-top: 30px;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
