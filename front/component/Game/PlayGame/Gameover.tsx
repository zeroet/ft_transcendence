import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "../../../styles/LayoutBox.module.css";

/**
 *
 * boolean 값으로 Win or Lose
 */
const Gameover = () => {
  const router = useRouter();
  const onClickToHome = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    router.push("/Home");
  }, []);
  return (
    <div className={`${styles.box} background-div`}>
      <div>
        <h1>PING PONG</h1>
      </div>
      <div className="gameover vibration">YOU WIN</div>
      <div className="btn-to-home" onClick={onClickToHome}>
        Home
      </div>
      <style jsx>{`
        .background-div {
          background-color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        h1 {
          background-color: black;
          color: white;
          font-size: 100px;
          font-family: "Lexend Deca", sans-serif;
        }
        .gameover {
          color: white;
          font-size: 50px;
        }
        .btn-to-home {
          color: white;
          background-color: gray;
          width: 100px;
          height: 30px;
          text-align: center;
          padding-top: 5px;
          margin-top: 30px;
          cursor: pointer;
        }
        .vibration {
          animation: vibration 0.1s infinite;
        }

        @keyframes vibration {
          from {
            transform: rotate(1deg);
          }
          to {
            transform: rotate(-1deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Gameover;
