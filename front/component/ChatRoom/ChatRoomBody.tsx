import axios from "axios";
import { useCallback, useState } from "react";
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
  const [inputText, setInputText] = useState<string>("");

  const onChangeInputText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
    },
    [inputText]
  );

  const onClickSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      console.log(inputText);
      // api통해서 업데이트 및 mutate수정
      setInputText("");
    },
    [inputText]
  );

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div className={styles.box}>
      <div className="roomname-img">
        <h1>{data.chatroomName}</h1>
        <img
          src={data.password ? "/images/private.png" : "/images/public.png"}
          width="20px"
        />
      </div>
      <hr />
      <ChatList />
      <ChatBox
        onChangeInputText={onChangeInputText}
        onClickSubmit={onClickSubmit}
        inputText={inputText}
      />
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
