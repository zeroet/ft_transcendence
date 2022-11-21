import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styles from "../../styles/LayoutBox.module.css";

export default function GameBody() {
  const [waitModal, setWaitModal] = useState(false);

  const socket = io('/api/test');

  console.log(socket);
  const onClickWaitModal = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setWaitModal((curr) => !curr);
  };

  useEffect(() => {}, []);
  return (
    <div className={styles.box}>
      {!waitModal ? (
        <img
          onClick={onClickWaitModal}
          className="img-vector"
          src="/images/Vector.png"
          width={300}
          height={90}
        />
      ) : (
        <div>haha</div>
      )}
      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
//   const [leftPaddle, setLeftPaddle] = useState<number>(50);
//   const [myScore, setMySore] = useState<number>(0);
//   const [otherSideScore, setOtherSideSore] = useState<number>(0);

//   const onChangeftPaddle = (e: KeyboardEvent) => {
//     const key = e.key;
//     if (key === "w" || key === "s") {
//       if (!(leftPaddle > 0 && leftPaddle < 100)) return;
//       if (key === "w") {
//         setLeftPaddle((curr) => curr - 0.8);
//       } else {
//         setLeftPaddle((curr) => curr + 0.8);
//       }
//     }
//   };

//   // serverside!!!!!!!!!!!
//   /**
//    * x 2 ~ 94
//    *
//    * y = 0 ~ 97
//    */

//   interface XYType {
//     x: number;
//     y: number;
//   }

//   // ball x
//   // const ballX = useRef<number>(50);
//   // const ballY = useRef<number>(50);
//   const ball = useRef<XYType>({
//     x: 50,
//     y: 50,
//   });
//   // ball speed
//   const [ballSpeed, setBallSpeed] = useState<number>(250);
//   // 상대편 플레이어
//   const [rightPaddle, setRightPaddle] = useState<number>(50);
//   // ball movement

//   const ballDirection = useRef<XYType>({
//     x: 1,
//     y: 1,
//   });

//   const ballMovement = () => {
//     if (
//       ball.current.x <= 2 ||
//       ball.current.x >= 94 ||
//       ball.current.y <= 0 ||
//       ball.current.y >= 97
//     ) {
//       if (ball.current.x <= 2) {
//         // ballDirectionX.current *= -1;
//         ballDirection.current.x *= -1;
//         ball.current.x += 1;
//         // ball.current.x = 50;
//         // ball.current.x = 50;
//       }
//       if (ball.current.x >= 94) {
//         ballDirection.current.x *= -1;
//         ball.current.x -= 1;
//         // ball.current.x = 50;
//         // ball.current.x = 50;
//       }
//       if (ball.current.y <= 0) {
//         ballDirection.current.y *= -1;
//         ball.current.y += 1;
//       }
//       if (ball.current.y >= 97) {
//         ballDirection.current.y *= -1;
//         ball.current.y -= 1;
//       }
//     }
//     // setBallDirection((curr) => curr * -1);
//     ball.current.x += ballDirection.current.x * 0.075;
//     ball.current.y += ballDirection.current.y * 0.05;
//   };

//   console.log(ball.current.x);
//   console.log(ball.current.y);

//   useEffect(() => {
//     window.addEventListener("keydown", onChangeftPaddle);
//   }, []);

//   const [rerender, setRerender] = useState(0);

//   useEffect(() => {
//     setInterval(() => {
//       ballMovement();
//       setRerender((curr) => curr + 1);
//     }, 5);
//   }, []);

//   // setInterval(() => {
//   //   // ballMovement();
//   //   console.log("ha");
//   // }, 1500);
//   // setRerender((curr) => curr + 1);
//   return (
//     <div className="gameBoard">
//       <div className="score">
//         <div className="score">{myScore}</div>
//         <div className="score">{otherSideScore}</div>
//       </div>
//       <div className="ball"></div>
//       <div className="paddle left"></div>
//       <div className="paddle right"></div>
//       <style jsx global>{`
//         *,
//         *::after,
//         *::before {
//           box-sizing: border-box;
//         }

//         :root {
//           --hue: 200;
//           --saturation: 0%;
//           --foreground-color: hsl(var(--hue), var(--saturation), 75%);
//           --background-color: hsl(var(--hue), var(--saturation), 20%);
//         }

//         .gameBoard {
//           padding: 10px;
//           background-color: var(--background-color);
//         }

//         .paddle {
//           position: absolute;
//           background-color: var(--foreground-color);
//           width: 1vh;
//           top: calc(var(--position) * 1vh);
//           height: 10vh;
//           trasform: traslate(-50%);
//         }

//         .left {
//           --position: ${leftPaddle};
//           left: 1vw;
//         }

//         .right {
//           --position: ${rightPaddle};
//           right: 1vw;
//         }

//         .score {
//           display: flex;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 7vh;
//           color: var(--foregroud-color);
//         }

//         .score > * {
//           flex-grow: 1;
//           flex-basis: 0;
//         }

//         .ball {
//           --x: ${ball.current.x};
//           --y: ${ball.current.y};

//           position: absolute;
//           background-color: var(--foreground-color);
//           left: calc(var(--x) * 1vw);
//           top: calc(var(--y) * 1vh);
//           trasform: traslate(-50%, -50%);
//           border-radius: 50%;
//           width: 2.5vh;
//           height: 2.5vh;
//         }
//       `}</style>
//     </div>
//   );
// }
