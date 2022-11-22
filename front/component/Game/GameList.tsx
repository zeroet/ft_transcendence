import { Socket } from "socket.io-client";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function GameList({ accessToken }: { accessToken: string }) {
  const [socket, disconnet] = useSocket(accessToken, "game");

  if (socket) {
    console.log("game list ", socket.id);
  }
  if (!socket) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      <ul>
        <li>game list 1</li>
        <li>game list 2</li>
        <li>game list 3</li>
      </ul>
    </div>
  );
}
