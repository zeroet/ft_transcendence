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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface GameElement {
  ballX: number;
  ballY: number;
  ballSize: number;
  leftPaddle: number;
  rightPaddle: number;
  myScore: string;
  otherSideScore: string;
}

// const ballLeftMax: 0;
// const ballRightMax: 1375;
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
  const [socket] = useSocket(accessToken, "game");
  // 방 이름 확인용. useEffect써서 리랜더링용
  const router = useRouter();

  // 마운트 파트
  // 게임
  //   const [gameChanged, setGameChanged] = useState<GameElement | undefined>(undefined);
  /**
   * ///////////////////////////////////////////////////////모든 위치 : 볼, 패들 을 중간값으로 주어야한다.
   */
  /**
   *
   *
   *
   */
  const [gameChanged, setGameChanged] = useState<GameElement | undefined>({
    ballX: 1475, // 0 ~ 1375
    ballY: 730, // 0 ~ 730
    ballSize: 50,
    leftPaddle: 650, // 0 ~ 650
    rightPaddle: 50,
    myScore: "1",
    otherSideScore: "3",
  });

  /**
   * /////////////////////////////////////////////////////// room 모든사람이아니라, room에 있는 플레이어들의 목록을 받아야함
   * /////////////////////////////////////////////////////// 소켓 id비교해서 룸안에있는사람만이 바꿀수있음!!!!!!!
   * /////////////////////////////////////////////////////// 모든조건에 넣어야함
   * /////////////////////////////////////////////////////// socket emit에만 넣으면 될듯
   * /////////////////////////////////////////////////////// @param e 이벤트
   * @returns
   */
  const onChangeftPaddle = (e: KeyboardEvent) => {
    if (gameChanged === undefined) return;
    const key = e.key;
    if (key === "w" || key === "s") {
      if (!(gameChanged.leftPaddle > 0 && gameChanged.leftPaddle < 100)) return;
      if (key === "w") {
        socket?.emit("paddle", {
          key: "up",
        });
        console.log(`left paddle 위치 :  ${gameChanged.leftPaddle}`);
      } else {
        // real
        socket?.emit("paddle", {
          key: "down",
        });
        console.log(`left paddle 위치 :  ${gameChanged.leftPaddle}`);
      }
    }
  };

  useEffect((): (() => void) => {
    console.log(
      `mount on play game ${router.query.id} room! with socket id : ${socket?.id}`
    );
    window.addEventListener("keydown", onChangeftPaddle);
    return () => {
      console.log(`mount off play game ${router.query.id} room!`);
    };
  }, [router.query.id]);
  ///////////////////////////////////////////////////////// deps 는 state들 바뀔때마다?하지않아도될듯
  ///////////////////////////////////////////////////////// set는 변하지않아도되므로!

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data || !socket) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div className="grid-div">
        <GameList accessToken={accessToken} />
        <div className="play-game">
          <div className="score">
            <div className="score">{gameChanged?.myScore}</div>
            <div className="score">{gameChanged?.otherSideScore}</div>
          </div>
          <div className="ball"></div>
          <div className="paddle left"></div>
          <div className="paddle right"></div>
        </div>
        <style jsx global>{`
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
            // --position: ${gameChanged?.leftPaddle}px;
            top: ${gameChanged && gameChanged.leftPaddle - 105}px;
          }

          .right {
            // --position: ${gameChanged?.rightPaddle}px;
            top: ${gameChanged && gameChanged.rightPaddle - 105}px;
            left: ${1500 - 10}px;
          }

          .score {
            display: flex;
            justify-content: center;
            font-weight: bold;
            font-size: 7vh;
            color: var(--foregroud-color);
          }

          .score > * {
            flex-grow: 1;
            flex-basis: 0;
          }

          .ball {
            // --x: ${gameChanged && gameChanged.ballX - 80}px;
            // --y: ${gameChanged && gameChanged.ballY - 80}px;

            position: relative;
            background-color: var(--foreground-color);
            // left: calc(var(--x) * 1vw);
            // top: calc(var(--y) * 1vh);
            left: ${gameChanged && gameChanged.ballX}px;
            top: ${gameChanged && gameChanged.ballY - 80}px;
            trasform: traslate(-50%, -50%);
            border-radius: 50%;
            width: ${gameChanged && gameChanged.ballSize / 2}px;
            height: ${gameChanged && gameChanged.ballSize / 2}px;
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
  // tokenManager(cookie);
  return {
    props: {
      accessToken,
      myRole,
    },
  };
};
