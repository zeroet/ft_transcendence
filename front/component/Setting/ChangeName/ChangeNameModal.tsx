import axios from "axios";
import { useCallback, useState } from "react";
import { mutate } from "swr";

const ChangeNameModal = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const [newNickName, setNewNickName] = useState<string>("");
  const getNewNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNickName(e.target.value);
      console.log(newNickName);
    },
    [newNickName]
  );
  const postNewName = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .post("/api/setting/username?", {
        username: newNickName,
      })
      .then(() => {})
      .catch((err) => console.log(err));
    setNewNickName("");
    modal(e);
    console.log(newNickName);
  };

  return (
    <div className="box">
      <div className="title">
        <h2>Change Name</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <div>
            <input
              onChange={getNewNickName}
              type="text"
              placeholder="New nick name"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button onClick={postNewName} className="ok">
            Submit
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .box {
          position: fixed;
          top: 30%;
          left: 37%;

          width: 500px;
          height: 300px;

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
        .submitform {
          // background-color: yellow;
          padding-left: 50px;
          padding-top: 20px;
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
          color: red;
        }
        button {
          text-align: center;
          padding-top: 30px;
        }
        .buttonDiv {
          // background-color: yellow;
          margin-top: 35px;
          text-align: center;
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

export default ChangeNameModal;
