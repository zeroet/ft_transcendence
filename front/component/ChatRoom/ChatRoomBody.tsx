import axios from "axios";
import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import ChatBox from "./ChatRoomBody/ChatBox";
import ChatList from "./ChatRoomBody/ChatList";
import ChatroomSettingModal from "./ChatroomSettingModal";
import { IChatContent } from "../../interfaceType";
import useSocket from "../Utils/socket";

export default function ChatRoomBody({
  chatroomId,
}: {
  chatroomId: string | string[] | undefined;
}) {
  const [socket] = useSocket(null, "chat");
  const { data, error } = useSWR(`/api/chatroom/${chatroomId}`);
  const [inputText, setInputText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const el = useRef<HTMLInputElement>(null);
  const { data: chatContentsData, error: chatContentsError } = useSWR<
    IChatContent[]
  >(`/api/chatroom/${chatroomId}/contents`);
  const handleCloseModal = (e: any) => {
    if (showModal && (!el.current || !el.current.contains(e.target))) {
      // console.log("close modal");
      setShowModal(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, [showModal]);

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
      await axios
        .post(`/api/chatroom/${chatroomId}/contents`, {
          content: inputText,
        })
        .then((res) => {
          console.log(res);
          mutate(`/api/chatroom/${chatroomId}/contents`);
        })
        .catch((err) => console.log(err));
      setInputText("");
    },
    [inputText, chatContentsData, data]
  );

  useEffect(() => {
    socket?.on("newContent", () => {
      mutate(`/api/chatroom/${chatroomId}/contents`);
    });
    return () => {
      socket?.off("newContent");
    };
  }, [data, chatContentsData]);

  if (error || chatContentsError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data || !chatContentsData) return <Loading />;

  const modal = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal((curr) => !curr);
  };

  return (
    <div className={styles.box}>
      {showModal && <ChatroomSettingModal />}
      <div className="roomname-header">
        <div className="roomname-img">
          <h1>{data.chatroomName}</h1>
          <img
            src={data.isPrivate ? "/images/private.png" : "/images/public.png"}
            width="20px"
          />
        </div>
        <img src="/images/config.png" className="config" onClick={modal} />
      </div>
      <hr />
      <ChatList chatroomId={chatroomId} chatContentsData={chatContentsData} />
      <ChatBox
        onChangeInputText={onChangeInputText}
        onClickSubmit={onClickSubmit}
        inputText={inputText}
      />
      <style jsx>
        {`
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
