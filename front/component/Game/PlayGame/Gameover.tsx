import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "../../../styles/LayoutBox.module.css";
import useSocket from "../../Utils/socket";
import cookies from "next-cookies";
import { GetServerSideProps } from "next";
import style from "../../../styles/firework.module.css";

const Gameover = ({
  winOrLose,
  accessToken,
}: {
  winOrLose: string;
  accessToken: string;
}) => {
  const router = useRouter();
  const [gameSocket] = useSocket(accessToken, "chat");
  const onClickToHome = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    router.push("/Home");
  }, []);
  return (
    <div className={`${styles.box} background-div`}>
      <div className={style.firework}></div>
      <div className={style.firework}></div>
      <div className={style.firework}></div>
      <div className={style.firework}></div>
      <div className={style.firework}></div>
      <div className={style.firework}></div>
      <div>
        <h1>GAME OVER</h1>
      </div>
      <div className="gameover vibration">{winOrLose}</div>
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
          background-color: red;
          height: 70px;
          color: white;
          font-size: 100px;
          font-family: "Lexend Deca", sans-serif;
        }
        .gameover {
          color: white;
          font-size: 50px;
        }
        .btn-to-home {
          color: black;
          background-color: yellow;
          width: 100px;
          height: 30px;
          text-align: center;
          padding-top: 5px;
          margin-top: 30px;
          cursor: pointer;
          font-weight: bold;
        }
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
      `}</style>
    </div>
  );
};

export default Gameover;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  const { isOwner } = context.query;
  if (!accessToken) {
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
      isOwner: isOwner ? isOwner : null,
    },
  };
};
