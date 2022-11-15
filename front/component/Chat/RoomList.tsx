import styles from "../../styles/LayoutBox.module.css";
import ChatRoom from "./RoomList/ChatRoom";
import DM from "./RoomList/DM";

export default function RoomList() {
  return (
    <div className={styles.box}>
      <ChatRoom />
      <DM />
    </div>
  );
}
