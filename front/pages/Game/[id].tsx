import cookies from "next-cookies";
import Layout from "../../component/Layout";
import Title from "../../component/Title";
import Loading from "../../component/errorAndLoading/Loading";
import useSocket from "../../component/Utils/socket";
import TwoFactorModal from "../../component/Home/TwoFactorModal";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Gameover from "../../component/Game/PlayGame/Gameover";
import GameExplain from "../../component/Game/PlayGame/GameExplain";
import { toast } from "react-toastify";

export default function Gaming({
  accessToken,
  myRole,
}: {
  accessToken: string;
  myRole: string;
}) {
  const { data, error } = useSWR("/api/users");
  const [socket, disconnect] = useSocket(accessToken, "game");
  const [isGameover, setIsGameover] = useState<boolean>(false);
  const router = useRouter();
  const [ballX, setBallX] = useState<number>(1500 / 2);
  const [ballY, setBallY] = useState<number>(750 / 2);
  const [ballSize, setBallSize] = useState<number>(50);
  const [leftPaddle, setLeftPaddle] = useState<number>(750 / 2);
  const [rightPaddle, setRightPaddle] = useState<number>(750 / 2);
  const [ownerScore, setOwnerScore] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [winOrLose, setWinOrLose] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [playerName, setplayerName] = useState<string>("");

  const onChangePaddle = useCallback(
    (e: KeyboardEvent) => {
      if (myRole === "watcher") return;
      const key = e.key;
      if (key === "w" || key === "s") {
        if (key === "w") {
          socket?.emit("paddle", 1);
        } else {
          socket?.emit("paddle", 2);
        }
      }
    },
    [leftPaddle, rightPaddle]
  );

  const statusChange = async (statusForChange: string) => {
    await axios
      .post(`/api/users/status`, {
        status: statusForChange,
      })
      .then((res) => {
        mutate(`/api/users/friend/list`);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect((): (() => void) => {
    statusChange("Game");

    socket?.emit("room-list");

    if (myRole === "watcher") {
      socket?.emit("watchGame", router.query.id);
    }

    if (myRole === "watcher") {
      socket?.on("roomx", () => {
        toast.error("Game already finished!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        // alert("방 이미 끝남. 나가!");
        router.push("/Home");
      });
    }

    socket?.on("playing", () => {
      if (myRole === "watcher") {
        toast.error("You're already playing!", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        // alert("You are already playing");
        router.push("/Home");
      }
    });

    socket?.on("gamecancel", () => {
      setWinOrLose("Game cancled");
      setIsGameover(true);
    });

    socket?.on("gameover", (winerName: string) => {
      setWinOrLose(ownerScore - playerScore > 0 ? ownerName : playerName);
      setWinOrLose(winerName + " is Winner");
      setIsGameover(true);
    });

    socket?.on(
      "info",
      (info: {
        x: number;
        y: number;
        name1: string;
        name2: string;
        score1: number;
        score2: number;
        paddle1: number;
        paddle2: number;
        ballsize: number;
      }) => {
        setBallX(info.x);
        setBallY(info.y);
        setOwnerName(info.name1);
        setplayerName(info.name2);
        setOwnerScore(info.score1);
        setPlayerScore(info.score2);
        setLeftPaddle(info.paddle1);
        setRightPaddle(info.paddle2);
        setBallSize(info.ballsize);
      }
    );
    console.log(
      `mount on play game ${router.query.id} room! with socket id : ${socket?.id}`
    );
    window.addEventListener("keydown", onChangePaddle);
    return () => {
      // window.removeEventListener("keydown", onChangeftPaddle);
      console.log(`mount off play game ${router.query.id} room!`);
      socket?.off("gameover");
      socket?.off("gamecancel");
      socket?.off("info");
      if (myRole !== "watcher") {
        statusChange("Login");
      }
      disconnect();
      console.log("언 마운트 실행!");
    };
  }, [socket?.id]);

  const onClickHome = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/Home");
  }, []);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data || !socket) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div className="header">
        <div className="home vibration" onClick={onClickHome}>
          Back to Home
        </div>
      </div>
      {/* <hr /> */}
      <div className="grid-div">
        <GameExplain />
        {isGameover ? (
          <Gameover winOrLose={winOrLose} accessToken={accessToken} />
        ) : (
          <div className="play-game">
            <div className="ball"></div>
            <div className="line"></div>
            <div className="players-name">
              <div className="players-name">{ownerName}</div>
              <div className="players-name">{playerName}</div>
            </div>
            <div className="score">
              <div className="score">{ownerScore}</div>
              <div className="score">{playerScore}</div>
            </div>
            <div className="paddle left"></div>
            <div className="paddle right"></div>
          </div>
        )}
        <style jsx global>{`
          .vibration {
            animation: vibration 0.1s infinite;
          }
          @keyframes vibration {
            from {
              transform: rotate(2deg);
            }
            to {
              transform: rotate(-2deg);
            }
          }
          .home {
            color: white;
            background-color: black;
            width: 150px;
            height: 30px;
            text-align: center;
            padding-top: 5px;
            margin-top: 30px;
            margin-bottom: 30px;
            cursor: pointer;
            text-transform: uppercase;
          }
          .home:hover {
            background-color: red;
          }
          .header {
            margin-top: 30px;
            display: flex;
            justify-content: space-around;
          }
          .grid-div {
            display: grid;
            grid-template-columns: 1fr 3fr;
          }
          *,
          *::after,
          *::before {
            box-sizing: border-box;
          }
          //   :root {
          //     --hue: 200;
          //     --saturation: 0%;
          //     --foreground-color: hsl(var(--hue), var(--saturation), 75%);
          //     --background-color: hsl(var(--hue), var(--saturation), 20%);
          //   }
          .play-game {
            //   padding: 10px;
            margin: 16px;
            background-color: black;
            // background-color: var(--background-color);
            overflow: hidden;
            width: 1500px;
            height: 750px;
          }
          .paddle {
            position: relative;
            background-color: yellow;
            // background-color: var(--foreground-color);
            width: 15px;
            top: calc(var(--position) * 1vh);
            height: 100px;
            // border-radius: 20%;
            transform: translate(-50%);
          }
          .left {
            // --position: ${leftPaddle}px;
            top: ${leftPaddle - 160}px;
          }
          .right {
            // --position: ${rightPaddle}px;
            top: ${rightPaddle - 260}px;
            left: ${1500}px;
          }
          .score {
            display: flex;
            justify-content: center;
            font-weight: bold;
            font-size: 7vh;
            color: grey;
            // color: var(--foregroud-color);
          }
          .players-name {
            display: flex;
            justify-content: center;
            font-weight: bold;
            font-size: 3vh;
            // color: white
            color: grey;
            text-transform: uppercase;
          }
          .score > * {
            flex-grow: 1;
            flex-basis: 0;
          }
          .players-name > * {
            flex-grow: 1;
            flex-basis: 0;
          }
          .ball {
            position: relative;
            background-color: yellow;
            // background-color: var(--foreground-color);
            left: ${ballX}px;
            top: ${ballY}px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            width: ${ballSize / 2}px;
            height: ${ballSize / 2}px;
          }
          .inner {
            background-color: white;
          }
        `}</style>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  const { myRole } = context.query;
  if (!accessToken || !myRole) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      accessToken,
      myRole,
    },
  };
};
