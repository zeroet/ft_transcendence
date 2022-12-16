import React, { useState, useCallback } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import { toast } from "react-toastify";

const ChangeNameAndPW = ({
  setShowChangeModal,
  roomId,
}: {
  setShowChangeModal: React.Dispatch<React.SetStateAction<Boolean>>;
  roomId: string;
}) => {
  const [RoomName, setName] = useState<string>("");
  const [RoomPw, setPw] = useState<string>("");
  const { data: roomData, error: roomError } = useSWR(
    `/api/chatroom/${roomId}`
  );
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };

  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw(e.target.value.trim());

  const createRoom = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (RoomPw && RoomPw.length < 4 && RoomPw.length > 0) {
        toast.error("Password should more than 4 character", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        setPw("");
        return;
      }
      await axios
        .patch(`/api/chatroom/${roomId}/update`, {
          chatroomName: RoomName === "" ? roomData.chatroomName : RoomName,
          password: RoomPw === "" ? null : RoomPw,
        })
        .then((res) => {
          mutate(`/api/chatroom/${roomId}`);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setShowChangeModal(false);
        });
    },
    [RoomName, RoomPw, roomData]
  );

  const cancelRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowChangeModal(false);
  };

  if (!roomData) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Change Room name / password</h2>
      </div>
      <form method="post">
        <div className="submitform">
          <label>new room name</label>
          <div>
            <input
              onChange={onChangeName}
              autoComplete="username"
              value={RoomName}
              type="text"
              autoFocus
              placeholder="leave it if you want to keep the room name"
            />
          </div>
          <label>new password</label>
          <div>
            <input
              onChange={onChangePw}
              value={RoomPw}
              type="password"
              autoComplete="current-password"
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
      {/* <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        limit={1}
        style={{ width: "500px", textAlign: "center" }}
        toastStyle={{
          textTransform: "none",
        }}
      /> */}
      <style jsx>{`
        .box {
          z-index: 1;
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

export default ChangeNameAndPW;
