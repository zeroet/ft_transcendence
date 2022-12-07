import cookies from "next-cookies";
import GameList from "../../component/Game/GameList";
import Layout from "../../component/Layout";
import Title from "../../component/Title";
import Loading from "../../component/errorAndLoading/Loading";
import useSocket from "../../component/Utils/socket";
import TwoFactorModal from "../../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Gameover from "../../component/Game/PlayGame/Gameover";

interface GameElement {
  ballX: number;
  ballY: number;
  ballSize: number;
  leftPaddle: number;
  rightPaddle: number;
  ownerScore: string;
  playerScore: string;
}

// const ballLeftMax: 0;
// const ballRightMax: 1375;
// const ballTopMax : 0;
// const ballBottomMax : 725
// const PaddleTopMax: 0;
// const paddleBottomMax: 650;

export default function Gaming({
  accessToken,
  myRole,
}: {
  accessToken: string;
  myRole: string;
}) {
  const { data, error } = useSWR("/api/users");
  const [socket, disconnect] = useSocket(accessToken, "game");
  // 게임오버 화면 만들어둠!
  const [isGameover, setIsGameover] = useState<boolean>(false);
  // otherPlayerName없어서 대체용
  const otherPlayerNameTest = "나중에 이거 지워야함";
  // 방 이름 확인용. useEffect써서 리랜더링용
  const router = useRouter();
  // 마운트 파트
  const [ballX, setBallX] = useState<number>(1375 / 2);
  const [ballY, setBallY] = useState<number>(725 / 2);
  const [ballSize, setBallSize] = useState<number>(50);
  const [leftPaddle, setLeftPaddle] = useState<number>(650 / 2);
  const [rightPaddle, setRightPaddle] = useState<number>(650 / 2);
  const [ownerScore, setOwnerScore] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [winOrLose, setWinOrLose] = useState<boolean>(true);
  /**
   * ///////////////////////////////////////////////////////모든 위치 : 볼, 패들 을 중간값으로 주어야한다.
   */
  /**
   *
   *
   *
   */

  /**
   * /////////////////////////////////////////////////////// room 모든사람이아니라, room에 있는 플레이어들의 목록을 받아야함
   * /////////////////////////////////////////////////////// 소켓 id비교해서 룸안에있는사람만이 바꿀수있음!!!!!!!
   * /////////////////////////////////////////////////////// 모든조건에 넣어야함
   * /////////////////////////////////////////////////////// socket emit에만 넣으면 될듯
   * /////////////////////////////////////////////////////// @param e 이벤트
   * @returns
   */
  // 문제: state가 객체로 되어있으면, 포인터가 바뀌는것이 아니기때문에,
  // 전체가 변화하지않음
  const onChangePaddle = useCallback(
    (e: KeyboardEvent) => {
      if (myRole === "watcher") return;
      const key = e.key;
      if (key === "w" || key === "s") {
        if (!(leftPaddle >= 0 && leftPaddle <= 650)) return;
        if (key === "w") {
          socket?.emit("paddle", {
            myRole,
            key: "up",
          });
          console.log(`left paddle 위치 :  ${leftPaddle}`);
        } else {
          socket?.emit("paddle", {
            myRole,
            key: "down",
          });
          console.log(`left paddle 위치 :  ${leftPaddle}`);
        }
      }
    },
    [leftPaddle, rightPaddle]
  );

  useEffect((): (() => void) => {
    socket?.emit("room-list");
    if (myRole === "watcher") {
      socket?.emit("watchGame", router.query.id);
    }
    socket?.on("gameover", () => {
      // 점수차이로 승패 저장
      if (myRole === "owner") {
        setWinOrLose(ownerScore - playerScore > 0 ? true : false);
      } else if (myRole === "player") {
        setWinOrLose(ownerScore - playerScore > 0 ? false : true);
      }
      setIsGameover(true);
    });
    socket?.on("ball", (x: number, y: number) => {
      console.log("s");
      setBallX(x);
      setBallY(y);
    });
    console.log(
      `mount on play game ${router.query.id} room! with socket id : ${socket?.id}`
    );
    window.addEventListener("keydown", onChangePaddle);
    return () => {
      // window.removeEventListener("keydown", onChangeftPaddle);
      console.log(`mount off play game ${router.query.id} room!`);
      socket?.off("ball");
      socket?.off("gameover");
      console.log(
        "game unmount!!!!!!!!!!!!!!!!!!!!!disconnect in 'Game [id].tsx'"
      );
      disconnect();
    };
  }, []);

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
          Home
        </div>
      </div>
      <hr />
      <div className="grid-div">
        <GameList accessToken={accessToken} />
        {/* 게임결과 보내기 */}
        {isGameover ? (
          <Gameover winOrLose={winOrLose} />
        ) : (
          <div className="play-game">
            <div className="players-name">
              <div className="players-name">
                {myRole === "owner" ? data.username : otherPlayerNameTest}
              </div>
              <div className="players-name">
                {myRole === "player" ? data.username : otherPlayerNameTest}
              </div>
            </div>
            <div className="score">
              <div className="score">{ownerScore}</div>
              <div className="score">{playerScore}</div>
            </div>
            <div className="ball"></div>
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
            background-color: gray;
            width: 100px;
            height: 30px;
            text-align: center;
            padding-top: 5px;
            margin-top: 30px;
            margin-bottom: 30px;
            cursor: pointer;
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

          :root {
            --hue: 200;
            --saturation: 0%;
            --foreground-color: hsl(var(--hue), var(--saturation), 75%);
            --background-color: hsl(var(--hue), var(--saturation), 20%);
          }

          .play-game {
            //   padding: 10px;
            margin: 15px;
            background-color: var(--background-color);
            overflow: hidden;
            width: 1500px;
            height: 750px;
          }

          .paddle {
            position: relative;
            background-color: var(--foreground-color);
            width: 10px;
            top: calc(var(--position) * 1vh);
            height: 100px;
            trasform: traslate(-50%);
          }

          .left {
            // --position: ${leftPaddle}px;
            top: ${leftPaddle - 160}px;
          }

          .right {
            // --position: ${rightPaddle}px;
            top: ${rightPaddle - 160}px;
            left: ${1500 - 10}px;
          }

          .score {
            display: flex;
            justify-content: center;
            font-weight: bold;
            font-size: 7vh;
            color: var(--foregroud-color);
          }

          .players-name {
            display: flex;
            justify-content: center;
            font-weight: bold;
            font-size: 5vh;
            color: gray;
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
            background-color: var(--foreground-color);
            left: ${ballX}px;
            top: ${ballY - 135}px;
            trasform: traslate(-50%, -50%);
            border-radius: 50%;
            width: ${ballSize / 2}px;
            height: ${ballSize / 2}px;
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
