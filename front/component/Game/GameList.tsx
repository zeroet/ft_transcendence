import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function GameList({ accessToken }: { accessToken: string }) {
  const [socket] = useSocket(accessToken, "game");
  const [roomList, setRoomList] = useState<string[]>([]);
 

  /**
   * 
   * room_list로 목록을 받으면,
   * roomList안에 리스트를 배열로
   * 배열후에, router.push()를 이용하여
   * query안에 myRole은 watcher이다.
   * 
   */
ㄴ
  useEffect((): (() => void) => {
    console.log(`socket on ${socket?.id}`);
    socket?.emit("room-list", "");
    socket?.on("room-list", (res) => {
      console.log(res, " is result from room list socket");
      setRoomList(res);
    });

    return () => {
      socket?.off("room-list");
      console.log(`socket off ${socket?.id}`);
    };
  }, [socket?.id]);
  if (!socket) return <Loading />;

  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      <ul></ul>
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
