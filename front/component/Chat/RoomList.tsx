import styles from "../../styles/LayoutBox.module.css";
import ChatRoom from "./RoomList/ChatRoom";
import DM from "./RoomList/DM";
import ChatListHeader from "./RoomList/ChatListHeader";
import DmHeader from "./RoomList/DmHeader";

export default function RoomList() {
  return (
    <div className={styles.box}>
      <ChatListHeader />
      <ChatRoom />
      <DmHeader />
      <DM />
    </div>
  );
}
