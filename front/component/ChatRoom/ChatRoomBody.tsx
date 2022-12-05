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
import { TypeChatId } from "../../interfaceType";

export default function ChatRoomBody({ id }: { id: TypeChatId }) {
  const [socket] = useSocket(null, "chat");
  const { data, error } = useSWR(`/api/${id.link}/${id.id}`);
  const [inputText, setInputText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const refModal = useRef<any>(null);
  const { data: chatContentsData, error: chatContentsError } = useSWR<
    IChatContent[]
  >(`/api/${id.link}/${id.id}/contents`);

  const handleCloseModal = useCallback(
    (e: any) => {
      if (!refModal?.current?.contains(e.target)) {
        setShowModal(false);
      }
    },
    [showModal, refModal]
  );

  useEffect(() => {
    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, []);

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
    [inputText, chatContentsData, data]
  );

  useEffect(() => {
    socket?.on("newContent", () => {
      mutate(`/api/${id.link}/${id.id}/contents`);
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
    setShowModal(true);
  };

  return (
    <div className={styles.box}>
      {showModal && (
        <div ref={refModal}>
          <ChatroomSettingModal />
        </div>
      )}
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
      <ChatList id={id} chatContentsData={chatContentsData} />
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
