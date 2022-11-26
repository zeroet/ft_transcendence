import cookies from "next-cookies";
import GameList from "../../component/Game/GameList";
import Layout from "../../component/Layout";
import Title from "../../component/Title";
import tokenManager from "../../component/Utils/tokenManager";
import Loading from "../../component/errorAndLoading/Loading";
import useSocket from "../../component/Utils/socket";
import TwoFactorModal from "../../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
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

export default function Gaming({ accessToken }: { accessToken: string }) {
  // https://www.kindacode.com/article/react-get-the-position-x-y-of-an-element/
  // https://www.daleseo.com/css-position/
  // https://linguinecode.com/post/how-to-use-react-useref-with-typescript
  // //////////////////////////////////////////////////////// ref 원도우 사이즈 알기위함
  // ref를 이용해서 윈도우 사이즈를 얻어, right paddle오른쪽값주고, 공도 relative로 사이즈를 주자
  const windowSize = useRef();

  const { data, error } = useSWR("/api/users");
  const [socket] = useSocket(accessToken, "game");
  const router = useRouter();

  console.log(windowSize);
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
    ballX: 50,
    ballY: 50,
    ballSize: 50,
    leftPaddle: 20,
    rightPaddle: 30,
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
        // real
        socket?.emit("paddle", {
          key: "up",
        });
        // test
        const value = gameChanged.leftPaddle - 1;
        setGameChanged({
          ...gameChanged,
          leftPaddle: value,
        });
        console.log(`left paddle 위치 :  ${gameChanged.leftPaddle}`);
      } else {
        // real
        socket?.emit("paddle", {
          key: "down",
        });
        // test
        // setGameChanged({
        //   ...gameChanged,
        //   leftPaddle: gameChanged.leftPaddle + 1,
        // });
        console.log(`left paddle 위치 :  ${gameChanged.leftPaddle}`);
      }
    }
  };

  useEffect((): (() => void) => {
    // socket?.on("connection");
    console.log(
      `mount on play game ${router.query.id} room! with socket id : ${socket?.id}`
    );
    window.addEventListener("keydown", onChangeftPaddle);
    socket?.on("playGame", async (res: GameElement) => {
      setGameChanged(res);
      ///////////////////////////////////////////////////////// setState!!!로 리렌더하면서 애니메이션
    });
    console.log(window);
    return () => {
      console.log(`mount off play game ${router.query.id} room!`);
      socket?.off("playGame");
      // socket?.leave(router.query.id);
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
        <div className="play-game" ref={windowSize}>
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
            --position: ${gameChanged?.leftPaddle};
          }

          .right {
            --position: ${gameChanged?.rightPaddle};
            left: ${window?.innerWidth - 10}px;
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
            --x: ${gameChanged?.ballX};
            --y: ${gameChanged?.ballY};

            position: relative;
            background-color: var(--foreground-color);
            left: calc(var(--x) * 1vw);
            top: calc(var(--y) * 1vh);
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
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  tokenManager(cookie);
  return {
    props: {
      accessToken,
    },
  };
};
