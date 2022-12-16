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
  useEffect((): (() => void) => {
    console.log(`socket on in Room List ${socket?.id}`);
    socket?.emit("room-list");
    socket?.on("room-list", (gameList) => {
      setRoomList(gameList);
      console.log(gameList);
      console.log("is game list");
    });

    return () => {
      socket?.off("room-list");
      console.log(`socket off in Room List ${socket?.id}`);
    };
  }, [socket?.id]);

  if (!socket) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      {roomList &&
        roomList.map((roomName: string) => {
          return (
            <ul>
              <Link
                href={{
                  pathname: `/Game/${roomName}`,
                  query: { myRole: "watcher" },
                }}
                key={roomName}
                legacyBehavior
              >
                <a>
                  <li className="room-name">
                    <img src="/images/watcher.png" /> {roomName}
                  </li>
                </a>
              </Link>
            </ul>
          );
        })}
      <style jsx>{`
        .room-name {
          display: flex;
        }
        img {
          width: 20px;
          height: auto;
        }
        li {
          list-style: none;
          margin-top: 15px;
          margin-left: -30px;
          font-size: 20px;
        }
        a {
          text-decoration: none;
          color: black;
        }
        strong {
          color: black;
        }
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
