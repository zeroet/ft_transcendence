import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";

const GameReadyModal = ({
  accessToken,
  closeSettingModal,
}: {
  accessToken: string;
  closeSettingModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const router = useRouter();
  const [socket] = useSocket(accessToken, "game");

  const onClickSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      socket?.emit("createRoom", {});

      //테스트용 원래는 useEffect에서 해야함
      console.log("game ready modal click ok");
      // router.push(`/Game/test!!!`);
    },
    []
  );

  useEffect((): (() => void) => {
    console.log("in game ready modal", socket?.id);
    socket?.on("game", (roonNameFromSocket) => {
      router.push(`/Game/${roonNameFromSocket}`);
    });
    return () => {
      console.log("off socket in game ready modal");
      socket?.off("game");
      // socket?.off("game_setting");
    };
  }, []);
  if (!socket) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Game setting</h2>
      </div>
      <form className="createForm" method="post">
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
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 130px;

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

export default GameReadyModal;
