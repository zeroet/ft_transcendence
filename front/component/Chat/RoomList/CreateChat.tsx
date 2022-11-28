import React, { useState, useEffect, FC, useCallback } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
}
const CreateChat: FC<Props> = ({ onClose }) => {
  // let [showModal, setShowModal] = useState<boolean>(true);
  //   useEffect(() => {
  //     const width = window.outerWidth / 2;
  //     const heigth = window.outerHeight / 2;
  //   }, []);
  const [RoomName, setName] = useState<string>();
  const [RoomPw, setPw] = useState<string>();
  //alert("create room button");

  const Name = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };
  
  const Pw = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw(e.target.value.trim());

  const createRoom = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      console.log(RoomName);
      console.log(RoomPw);

      await axios
        .post("/api/chatroom", { chatroomName: RoomName, password: RoomPw })
        .then(() => {
          setName("");
          setPw("");
        })
        .catch((error) => {
          console.dir(error);
        })
        .finally(() => {
          cancelRoom();
        });
    },
    [RoomName, RoomPw]
  );

  const cancelRoom = () => {
    onClose();
  };

  return (
    <div className="box">
      <div className="title">
        <h2>Create Chat Room</h2>
      </div>
      <form>
        <div className="submitform">
          <label>name</label>
          <div>
            <input onChange={Name} type="text" />
          </div>
          <label>password</label>
          <div>
            <input
              onChange={Pw}
              type="password"
              placeholder="for private room (more than 4 caracters)"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button type="submit" onClick={createRoom} className="ok">
            OK
          </button>
          <button type="submit" onClick={cancelRoom} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .box {
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

export default CreateChat;
