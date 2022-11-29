import styles from "../../styles/LayoutBox.module.css";
import ChatRoom from "./RoomList/ChatRoom";
import DM from "./RoomList/DM";
import ChatListHeader from "./RoomList/ChatListHeader";
import DmHeader from "./RoomList/DmHeader";

export default function RoomList({ accessToken }: { accessToken: string }) {
  return (
    <div className={styles.box}>
      <ChatListHeader />
      <ChatRoom accessToken={accessToken} />
      <DmHeader />
      <DM />
    </div>
  );
}
