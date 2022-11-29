import Link from "next/link";
import { useEffect } from "react";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

// dummy file!
let gameList = [
  {
    id: 1,
    gameName: "hyungyoo vs seyun",
  },
  {
    id: 2,
    gameName: "hello! cjung-mo's room!",
  },
  {
    id: 3,
    gameName: "eyoo vs keulee",
  },
];

export default function GameList({ accessToken }: { accessToken: string }) {
  const [socket] = useSocket(accessToken, "game");
  // 소켓을 이용하여, socket.on으로 게임리스트를 받는다.
  // 리스트는 밑에 출력,
  // 게임이름이 라우팅으로

  useEffect((): (() => void) => {
    socket?.on("gameList", (res) => {
      console.log("game list ", socket.id);
      const gameList = res;
    });
    return () => socket?.off("gameList");
  }, []);
  if (!socket) return <Loading />;

  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      <ul>
        {gameList.map((res) => {
          return (
            <li key={res.id}>
              <Link href={`/Game/${res.gameName}`}>{res.gameName}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
