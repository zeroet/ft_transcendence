import { useCallback, useState } from "react";
import styles from "../../styles/LayoutBox.module.css";
import ChatBox from "../ChatRoom/ChatRoomBody/ChatBox";
import ChatList from "../ChatRoom/ChatRoomBody/ChatList";
import { TypeChatId } from "../../interfaceType";
import useSWR from "swr";
import axios from "axios";
import Loading from "../errorAndLoading/Loading";

export default function DMRoomBody({ id }: { id: TypeChatId }) {
  const [inputText, setInputText] = useState<string>("");
  const { data: chatContentsData, error: chatContentsError } = useSWR<any>(
    `/api/${id.link}/${id.id}/contents`
  );

  console.log(chatContentsData);
  const onChangeInputText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
    },
    [inputText]
  );

  const onClickSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (inputText === "") return;
      console.log(inputText, "in chating room body");
      // api통해서 업데이트 및 mutate수정
      // optimistic ui
      //   await axios
      //     .post(`/api/${id.link}/${id.id}/contents`, {
      //       content: inputText,
      //     })
      //     .then((res) => {
      //       console.log(res);
      //       mutate(`/api/${id.link}/${id.id}/contents`);
      //     })
      //     .catch((err) => console.log(err));
      setInputText("");
    },
    [inputText]
  );

  if (chatContentsError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!chatContentsData) return <Loading />;
  return (
    <div className={styles.box}>
      <div className="roomname-header">
        <div className="roomname-img">
          <h1>{"dm name!!!"}</h1>
        </div>
      </div>
      <hr />
      <ChatList id={id} chatContentsData={chatContentsData} />
      <ChatBox
        onChangeInputText={onChangeInputText}
        onClickSubmit={onClickSubmit}
        inputText={inputText}
      />
      <style jsx>
        {`
          .ChatroomSettingModal {
            display: relative;
          }
          .ModalWrapper {
            background-color: red;
          }
          img {
            padding-left: 10px;
          }
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
