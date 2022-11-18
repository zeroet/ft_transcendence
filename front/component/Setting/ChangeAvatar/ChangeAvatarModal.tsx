import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { mutate } from "swr";

const ChangeAvatarModal = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  return (
    <div className="box">
      <div className="title">
        <h2>Change Avatar</h2>
      </div>
      <form className="createForm" method="post">
        <div className="upload-file">
          <img height={27} src={"/images/search.png"} />
          <button className="button-upload-file">UPLOAD FILE</button>
        </div>
        <div className="buttonDiv">
          <button className="ok">Submit</button>
          <button className="cancel">Cancel</button>
        </div>
      </form>
      <style jsx>{`
        .upload-file {
          margin-top: 30px;
          margin-bottom: 30px;
          border: 2px solid black;
          width: 250px;
          box-shadow: 10px 10px white initial;
        }

        .button-upload-file {
          padding: 10px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          // box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
          // height: 100%;
        }

        .createForm {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
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
        input::placeholder {
          text-align: center;
          color: red;
        }
        button {
          text-align: center;
          padding-top: 20px;
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
};

export default ChangeAvatarModal;
