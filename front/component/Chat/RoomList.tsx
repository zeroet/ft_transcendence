import styles from "../../styles/LayoutBox.module.css";
import ChatRoom from "./ChatRoom/ChatRoom";
import DM from "./ChatRoom/DM";

export default function RoomList() {
  return (
    <div className={styles.box}>
      <ChatRoom />
      <DM />
    </div>
  );
}
