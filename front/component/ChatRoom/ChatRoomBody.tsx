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
import { TypeChatId, IChatParticipant } from "../../interfaceType";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function ChatRoomBody({ id }: { id: TypeChatId }) {
  const router = useRouter();
  const [socket] = useSocket(null, "chat");
  const { data: roomData, error: roomError } = useSWR(
    `/api/${id.link}/${id.id}`
  );
  const { data: userData, error: userError } = useSWR("/api/users");
  const [inputText, setInputText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const refModal = useRef<any>(null);
  const { data: chatContentsData, error: chatContentsError } = useSWR<
    IChatContent[]
  >(`/api/${id.link}/${id.id}/contents`);
  const { data: chatroomMembersData, error: chatroomMembersError } = useSWR(
    `/api/chatroom/${id.id}/participants`
  );
  const [isMute, setIsMuted] = useState<boolean>(false);

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
    [inputText, userData]
  );

  const onClickSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (inputText === "") return;
      console.log(inputText, "in chating room body");
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
    [inputText, chatContentsData, roomData, userData, socket?.id]
  );

  useEffect(() => {
    if (chatroomMembersData && userData) {
      chatroomMembersData.map((res: IChatParticipant) => {
        if (res.userId === userData.id && res.chatroomId.toString() === id.id) {
          if (res.mutedAt) {
            setIsMuted(true);
            toast.info(
              `You are muted for 10 seconds at: [${roomData.chatroomName}]`,
              {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: false,
                pauseOnHover: false,
              }
            );
          }
          if (res.bannedAt) {
            toast.info(`You are banned from room: [${roomData.chatroomName}]`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              rtl: false,
              pauseOnFocusLoss: true,
              draggable: false,
              pauseOnHover: false,
            });
            // alert(`You are baned room name : [${roomData.chatroomName}]`);
            router.push("/Chat");
          }
        }
      });
    }
    socket?.on("newRoomList", () => {
      mutate(`/api/${id.link}/${id.id}`);
      mutate("/api/chatroom");
    });
    socket?.on("newContent", () => {
      mutate(`/api/${id.link}/${id.id}/contents`);
    });
    socket?.on("deleteChatroom", (roomId: number) => {
      if (id.link === "chatroom" && roomId.toString() === id.id)
        router.push("/Chat");
      mutate("/api/chatroom");
    });
    socket?.on(
      "kick",
      ({
        chatroomId,
        targetUserId,
      }: {
        chatroomId: number;
        targetUserId: number;
      }) => {
        if (chatroomId.toString() === id.id && targetUserId === userData.id) {
          router.push("/Chat");
          toast.info(
            `you justed kicked from the room [${roomData.chatroomName}]`,
            {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              rtl: false,
              pauseOnFocusLoss: true,
              draggable: false,
              pauseOnHover: false,
            }
          );
        }
        if (id.link === "chatroom") mutate(`/api/chatroom/${id.id}/members`);
      }
    );
    socket?.on("mute", () => {
      if (id.link === "chatroom") mutate(`/api/chatroom/${id.id}/participants`);
    });
    socket?.on("ban", () => {
      if (id.link === "chatroom") mutate(`/api/chatroom/${id.id}/participants`);
    });
    return () => {
      socket?.off("newRoomList");
      socket?.off("newContent");
      socket?.off("deleteChatroom");
      socket?.off("kick");
      socket?.off("mute");
      socket?.off("ban");
      setIsMuted(false);
    };
  }, [roomData, chatContentsData, userData, socket?.id, chatroomMembersData]);

  const onClickShowSettingModal = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(true);
  };

  if (roomError || chatContentsError || userError || chatroomMembersError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!roomData || !userData || !chatContentsData || !chatroomMembersData)
    return <Loading />;
  return (
    <div className={styles.box}>
      {showModal && (
        <div ref={refModal} className="ChatroomSettingModal">
          <ChatroomSettingModal
            roomId={id.id}
            isOwner={roomData.ownerId === userData.id}
          />
        </div>
      )}
      <div className="roomname-header">
        <div className="roomname-img">
          <h1>{roomData.chatroomName}</h1>
          <img
            src={
              roomData.isPrivate ? "/images/private.png" : "/images/public.png"
            }
            width="20px"
          />
        </div>
        {id.link === "chatroom" && (
          <img
            src="/images/config.png"
            className="config"
            onClick={onClickShowSettingModal}
          />
        )}
      </div>
      <hr />
      <ChatList id={id} chatContentsData={chatContentsData} />
      <ChatBox
        isMute={isMute}
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
