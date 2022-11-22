import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";

const GameSettingModal = ({
  accessToken,
  closeSettingModal,
}: {
  accessToken: string;
  closeSettingModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const router = useRouter();
  const [socket, disconnet] = useSocket(accessToken, "game");
  const [speed, setSpeed] = useState<string>("50");
  const [ballSize, setBallSize] = useState<string>("50");

  const onClickSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("=========================ball speed", speed);
      console.log("=========================ball size", ballSize);
      setSpeed("50");
      setBallSize("50");

      // socket 에 emit!!으로 스피트, 볼사이즈 넘겨준다.

      // 그리고 게임시작
      router.push("/Game/1");
    },
    [speed, ballSize]
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

  //   if (socket && socket.id) {
  //     console.log(`game speed and ball setting modal ${socket.id}`);
  //   }
  if (!socket) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Game setting</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
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
          height: 300px;

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
