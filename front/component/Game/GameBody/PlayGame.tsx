import { useCallback, useEffect, useState } from "react";
import Loading from "../../../component/errorAndLoading/Loading";
import useSocket from "../../../component/Utils/socket";

interface GameElement {
  ballX: string;
  ballY: string;
  leftPaddle: string;
  rightPaddle: string;
  myScore: string;
  otherSideScore: string;
}

const PlayGame = ({ accessToken }: { accessToken: string }) => {
  const [socket] = useSocket(accessToken, "game");
  const [gameChanged, setGameChanged] = useState<GameElement>({
    ballX: "",
    ballY: "",
    leftPaddle: "",
    rightPaddle: "",
    myScore: "",
    otherSideScore: "",
  });

  // 내가 패들 수정. socket.emit으로 보내야함
  const onChangeftPaddle = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    if (key === "w" || key === "s") {
      if (!(gameChanged.leftPaddle > "0" && gameChanged.leftPaddle < "100"))
        return;
      if (key === "w") {
        socket?.emit("paddle", {
          key: "w",
        });
      } else {
        socket?.emit("paddle", {
          key: "s",
        });
      }
    }
  }, []);

  useEffect((): (() => void) => {
    window.addEventListener("keydown", onChangeftPaddle);
    console.log("in play game", socket?.id);
    socket?.on("playGame", (res: GameElement) => {
      setGameChanged(res);
      // setState!!!로 리렌더하면서 애니메이션
    });
    return () => socket?.off("playGame");
  }, []);
  // deps 는 state들 바뀔때마다?하지않아도될듯
  // set는 변하지않아도되므로!

  if (!socket) return <Loading />;
  return (
    <div>
      <div className="score">
        <div className="score">{gameChanged.myScore}</div>
        <div className="score">{gameChanged.otherSideScore}</div>
      </div>
      <div className="ball"></div>
      <div className="paddle left"></div>
      <div className="paddle right"></div>
      <style jsx global>{`
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

        body {
          padding: 10px;
          background-color: var(--background-color);
        }

        .paddle {
          position: absolute;
          background-color: var(--foreground-color);
          width: 1vh;
          top: calc(var(--position) * 1vh);
          height: 10vh;
          trasform: traslate(-50%);
        }

        .left {
          --position: ${gameChanged.leftPaddle};
          left: 1vw;
        }

        .right {
          --position: ${gameChanged.rightPaddle};
          right: 1vw;
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
          --x: ${gameChanged.ballX};
          --y: ${gameChanged.ballY};

          position: absolute;
          background-color: var(--foreground-color);
          left: calc(var(--x) * 1vw);
          top: calc(var(--y) * 1vh);
          trasform: traslate(-50%, -50%);
          border-radius: 50%;
          width: 2.5vh;
          height: 2.5vh;
        }
      `}</style>
    </div>
  );
};

export default PlayGame;

/**
 * 
interface XYType {
  x: number;
  y: number;
}

const PlayGame = ({ accessToken }: { accessToken: string }) => {
  const [socket, disconnet] = useSocket(accessToken, "game");

  if (socket) {
    console.log("in play game", socket.id);
  }

  const [leftPaddle, setLeftPaddle] = useState<number>(50);
  const [myScore, setMySore] = useState<number>(0);
  const [otherSideScore, setOtherSideSore] = useState<number>(0);

  const onChangeftPaddle = (e: KeyboardEvent) => {
    const key = e.key;
    if (key === "w" || key === "s") {
      if (!(leftPaddle > 0 && leftPaddle < 100)) return;
      if (key === "w") {
        setLeftPaddle((curr) => curr - 0.8);
      } else {
        setLeftPaddle((curr) => curr + 0.8);
      }
    }
  };

  // serverside!!!!!!!!!!!
   * x 2 ~ 94
   *
   * y = 0 ~ 97

  // ball x
  // const ballX = useRef<number>(50);
  // const ballY = useRef<number>(50);
  const ball = useRef<XYType>({
    x: 50,
    y: 50,
  });
  // ball speed
  const [ballSpeed, setBallSpeed] = useState<number>(250);
  // 상대편 플레이어
  const [rightPaddle, setRightPaddle] = useState<number>(50);
  // ball movement

  const ballDirection = useRef<XYType>({
    x: 1,
    y: 1,
  });

  const ballMovement = () => {
    if (
      ball.current.x <= 2 ||
      ball.current.x >= 94 ||
      ball.current.y <= 0 ||
      ball.current.y >= 97
    ) {
      if (ball.current.x <= 2) {
        // ballDirectionX.current *= -1;
        ballDirection.current.x *= -1;
        ball.current.x += 1;
        // ball.current.x = 50;
        // ball.current.x = 50;
      }
      if (ball.current.x >= 94) {
        ballDirection.current.x *= -1;
        ball.current.x -= 1;
        // ball.current.x = 50;
        // ball.current.x = 50;
      }
      if (ball.current.y <= 0) {
        ballDirection.current.y *= -1;
        ball.current.y += 1;
      }
      if (ball.current.y >= 97) {
        ballDirection.current.y *= -1;
        ball.current.y -= 1;
      }
    }
    // setBallDirection((curr) => curr * -1);
    ball.current.x += ballDirection.current.x * 0.075;
    ball.current.y += ballDirection.current.y * 0.05;
  };

  //   console.log(ball.current.x);
  //   console.log(ball.current.y);

  useEffect(() => {
    window.addEventListener("keydown", onChangeftPaddle);
  }, []);

  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    setInterval(() => {
      ballMovement();
      setRerender((curr) => curr + 1);
    }, 5);
  }, []);

   *  언마운트가 아닌, 게임이 끝난후에 소켓 제거하자!!!!!!!!!!
  //   // 게임완료후에 소켓제거
  //   useEffect(() => {
  //     return () => {
  //       // 언마운트시 소켓 제거
  //       disconnet();
  //     };
  //   }, []);
  // setInterval(() => {
  //   // ballMovement();
  //   console.log("ha");
  // }, 1500);
  // setRerender((curr) => curr + 1);
  if (!socket) return <Loading />;
  return (
    <div>
      <div className="score">
        <div className="score">{myScore}</div>
        <div className="score">{otherSideScore}</div>
      </div>
      <div className="ball"></div>
      <div className="paddle left"></div>
      <div className="paddle right"></div>
      <style jsx global>{`
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

        body {
          padding: 10px;
          background-color: var(--background-color);
        }

        .paddle {
          position: absolute;
          background-color: var(--foreground-color);
          width: 1vh;
          top: calc(var(--position) * 1vh);
          height: 10vh;
          trasform: traslate(-50%);
        }

        .left {
          --position: ${leftPaddle};
          left: 1vw;
        }

        .right {
          --position: ${rightPaddle};
          right: 1vw;
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
          --x: ${ball.current.x};
          --y: ${ball.current.y};

          position: absolute;
          background-color: var(--foreground-color);
          left: calc(var(--x) * 1vw);
          top: calc(var(--y) * 1vh);
          trasform: traslate(-50%, -50%);
          border-radius: 50%;
          width: 2.5vh;
          height: 2.5vh;
        }
      `}</style>
    </div>
  );
};

export default PlayGame;

export function getServerSideProps(context: any) {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
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
}

 */
