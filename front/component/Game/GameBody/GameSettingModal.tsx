import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";
import { GameDTO } from "../../../interfaceType";
// 오너가 아니면, 일반 체크만 하는 페이지도 만들어야한다

const GameSettingModal = ({
  accessToken,
  closeSettingModal,
}: {
  accessToken: string;
  closeSettingModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const router = useRouter();
  const [socket] = useSocket(accessToken, "game");
  const [speed, setSpeed] = useState<string>("50");
  const [ballSize, setBallSize] = useState<string>("50");
  const [roomName, setRoomName] = useState<string>("");

  const onClickSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!roomName) {
        alert("Room name please");
        return;
      }

      // 그리고 게임시작
      socket?.emit("startGame", {
        roomName,
        speed,
        ballSize,
      });

      // setSpeed("50");
      // setBallSize("50");
      // setRoomName("");
      //테스트용 원래는 useEffect에서 해야함
      // 확인! 셋팅
      console.log(
        `game room name : ${roomName}, ball size : ${ballSize}, ball speed : ${speed}`
      );
      
      setRoomName("");
      // router.push(`/Game/test!!!`);
    },
    [speed, ballSize, roomName]
  );

  const onChangeSpeed = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setSpeed(e.target.value);
      console.log(speed);
    },
    [speed]
  );

  const onChangeBallSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setBallSize(e.target.value);
    },
    [ballSize]
  );

  const onChangeRoomName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRoomName(e.target.value.trim());
      console.log(roomName);
    },
    [roomName]
  );

  useEffect((): (() => void) => {
    console.log("game setting owner modal", socket?.id);

    // 완료된 소켓! 받은후에 이동
    socket?.on("enterGame", (roomName: string) => {
      console.log(roomName, " is room name from server event: enterGame");
      router.push(`/Game/${roomName}`);
    });
    return () => {
      console.log("off socket in game setting modal");
      socket?.off("enterGame");
      // socket?.off("createRoom");
    };
  }, [socket?.id]);

  if (!socket) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Game setting</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <div className="input input-text">
            <p>Room Name</p>
            <input
              onChange={onChangeRoomName}
              value={roomName}
              className="input-bar"
              type="text"
            />
          </div>
          <div className="input">
            <p>Speed</p>
            <input
              onChange={onChangeSpeed}
              value={speed}
              className="input-bar"
              type="range"
            />
          </div>
          <div className="input">
            <p>Ball Size</p>
            <input
              onChange={onChangeBallSize}
              value={ballSize}
              className="input-bar"
              type="range"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button onClick={onClickSubmit} className="ok">
            Ready
          </button>
          <button onClick={closeSettingModal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .input-bar {
          width: 300px;
        }
        .input-text {
          height: 40px;
        }
        .submitform {
          display: grid;
          grid-template-rows: 1fr 1fr;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 330px;

          background-color: white;
          border: 1px inset black;
          // box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          text-align: center;
          background-color: black;
          color: white;

          //   height: 100%;
        }

        .input {
          display: flex;
          justify-content: space-evenly;
          width: 100%;
          margin-top: 0;
          //   background-color: red;
        }

        button {
          text-align: center;
          padding-top: 20px;
        }
        .buttonDiv {
          display: flex;
          justify-content: space-evenly;
          //   background-color: yellow;
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

export default GameSettingModal;
