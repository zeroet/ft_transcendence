import axios from "axios";
import useSWR from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import ChatBox from "./ChatRoomBody/ChatBox";
import ChatList from "./ChatRoomBody/ChatList";

export default function ChatRoomBody({
  chatroomId,
}: {
  chatroomId: string | string[] | undefined;
}) {
  const { data, error } = useSWR(`/api/chatroom/${chatroomId}`);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div className={styles.box}>
      <div className="roomname-img">
        <h1>{data.chatroomName}</h1>
        <img
          src={
            data.password
              ? "/images/private_room.png"
              : "/images/public_room.png"
          }
          width="45px"
        />
      </div>
      <hr />
      <ChatList />
      <ChatBox />
      <style jsx>
        {`
          .roomname-img {
            display: flex;
            align-items: center;
          }
          h1 {
            font-family: "Fragment Mono", monospace;
            font-size: 25px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 10px;
          }
        `}
      </style>
    </div>
  );
}
