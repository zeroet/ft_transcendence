import axios from "axios";
import useSWR from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";

export default function ChatRoomBody({
  chatroomId,
}: {
  chatroomId: string | string[] | undefined;
}) {
  const { data, error } = useSWR(`/api/chatroom/${chatroomId}`);

  console.log(typeof chatroomId);
  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>{data.chatroomName}</h1>
      <hr />
      <div className="c-body">
        <h1>여기에 채팅구현하면 됨</h1>
      </div>
      <style jsx>
        {`
          h1 {
            font-family: "Fragment Mono", monospace;
            font-size: 25px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 10px;
          }
          .c-body {
            height: 90%;
            margin-left: 10px;
            margin-right: 10px;
            // background-color: tomato;
            text-align: center;
          }
          .c-body h1 {
            // background-color: blue;
            padding: 46% 0;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
