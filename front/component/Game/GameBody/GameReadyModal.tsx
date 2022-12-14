import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";

const GameReadyModal = ({
  accessToken,
  closeSettingModal,
  username,
}: {
  accessToken: string;
  closeSettingModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  username: string;
}) => {
  const router = useRouter();
  const [socket] = useSocket(accessToken, "game");

  useEffect((): (() => void) => {
    toast.success("player matched!", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: false,
      pauseOnHover: false,
    });
    console.log("in game ready modal", socket?.id);
    socket?.on("enterGame", (roomName: string) => {
      socket?.emit("myname", username);
      console.log(roomName);
      console.log("is room name! from socket");
      // query로 게임이름
      // 내가 오너인지, 내가 플레이어인지 가지고들어간다.
      router.push({
        pathname: `/Game/${roomName}`,
        query: {
          myRole: "player",
        },
      });
    });
    return () => {
      console.log("off socket in game ready modal");
      socket?.off("enterGame");
    };
  }, [socket?.id]);

  if (!socket) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Setting game...</h2>
      </div>
      <div>
        <p>The other player sets the game!</p>
        <p>Wait a second please!</p>
        <p>(Or not ! :p)</p>
      </div>
      <form className="createForm" method="post">
        <div className="buttonDiv">
          <button onClick={closeSettingModal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        p {
          font-weight: bold;
          text-align: center;
          font-size: 17px;
          margin: 15px;
        }
        h2 {
          animation: blink-effect 1s step-end infinite;
        }

        @keyframes blink-effect {
          50% {
            opacity: 0;
          }
        }

        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 250px;

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
        .cancel {
          color: white;
          background-color: black;
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
