import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/LayoutBox.module.css";
import ChatBox from "../ChatRoom/ChatRoomBody/ChatBox";
import ChatList from "../ChatRoom/ChatRoomBody/ChatList";
import { TypeChatId } from "../../interfaceType";
import useSWR, { mutate } from "swr";
import axios from "axios";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";
import { useRouter } from "next/router";

export default function DMRoomBody({ id }: { id: TypeChatId }) {
  const router = useRouter();
  const [inputText, setInputText] = useState<string>("");
  const { data: chatContentsData, error: chatContentsError } = useSWR<any>(
    `/api/${id.link}/${id.id}/contents`
  );
  const [socket] = useSocket(null, "chat");
  const { data: mydata, error: myErorr } = useSWR("/api/users");
  const { data: infoDmRoomData, error: infoDmRoomError } = useSWR(
    `/api/${id.link}/${id.id}`
  );

  useEffect(() => {
    socket?.on("newDmContent", () => {
      mutate(`/api/${id.link}/${id.id}/contents`);
    });
    return () => {
      socket?.off("newDmContent");
    };
  }, [chatContentsData, mydata, infoDmRoomData]);

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
      await axios
        .post(`/api/${id.link}/${id.id}/contents`, {
          content: inputText,
        })
        .then((res) => {
          console.log(res);
          mutate(`/api/${id.link}/${id.id}/contents`);
        })
        .catch((err) => console.log(err));
      setInputText("");
    },
    [inputText]
  );

  if (
    !(
      infoDmRoomData?.User1.id === mydata?.id ||
      infoDmRoomData?.User2.id === mydata?.id
    )
  ) {
    router.push("/Chat");
  }
  if (chatContentsError || myErorr || infoDmRoomError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!chatContentsData || !infoDmRoomData || !socket || !mydata)
    return <Loading />;
  return (
    <div className={styles.box}>
      <div className="roomname-header">
        <div className="roomname-img">
          <h1>
            {infoDmRoomData.User1.id === mydata.id
              ? infoDmRoomData.User2.username
              : infoDmRoomData.User1.username}
          </h1>
        </div>
      </div>
      <hr />
      <ChatList id={id} chatContentsData={chatContentsData} />
      <ChatBox
        isMute={false}
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
