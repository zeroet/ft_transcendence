import { Socket } from "socket.io-client";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";

export default function GameList({ socket }: { socket: Socket }) {
  
  
  
  
  
  if (socket) {
    console.log("game list ", socket);
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
