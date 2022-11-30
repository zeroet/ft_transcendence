import axios from "axios";
import { useState } from "react";
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

  const [showModal, setShowModal] = useState<boolean>(false);
  const modal = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal((curr) => !curr);
  };

  return (
    <div className={styles.box}>
      {showModal && (
        <div className="modal-background">
          <ChatroomSettingModal modal={modal} />
        </div>
      )}
      <div className="roomname-header">
        <div className="roomname-img">
          <h1>{data.chatroomName}</h1>
          <img
            src={data.password ? "/images/private.png" : "/images/public.png"}
            width="20px"
          />
        </div>
        <img src="/images/config.png" className="config" onClick={modal} />
      </div>
      <hr />
      <ChatList />
      <ChatBox />
      <style jsx>
        {`
          .roomname-header {
            display: flex;
            justify-content: space-between;
          }
          .config {
            width: 25px;
            height: 25px;
            padding-top: 20px;
            padding-right: 25px;
            cursor: pointer;
          }
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
