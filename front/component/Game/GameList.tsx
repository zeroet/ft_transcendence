import Link from "next/link";
import { useEffect } from "react";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function GameList({ accessToken }: { accessToken: string }) {
  const [socket] = useSocket(accessToken, "game");
  // 소켓을 이용하여, socket.on으로 게임리스트를 받는다.
  // 리스트는 밑에 출력,
  // 게임이름이 라우팅으로

  useEffect((): (() => void) => {
    console.log(`socket on ${socket?.id}`);
    socket?.on("room-list", (res) => {
      console.log(res, " is result from room list socket");
      return () => {
        socket.off("room-list");
        console.log(`socket off ${socket.id}`);
      };
    });
    // socket?.on("gameList", (res) => {
    //   console.log("game list ", socket.id);
    //   const gameList = res;
    //   console.log("game list is", gameList);
    // });
    return () => {};
  }, [socket?.id]);
  if (!socket) return <Loading />;

  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      <ul>
        {/* {gameList &&
          gameList.map((res) => {
            return (
              <li key={res.id}>
                <Link href={`/Game/${res.gameName}`}>{res.gameName}</Link>
              </li>
            );
          })} */}
      </ul>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
