import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { mutate } from "swr";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";
import ChangeNameAndPW from "./ChatroomSettingModal/ChangeNameAndPW";

export default function ChatroomSettingModal({
  roomId,
  ownerId,
  userId,
}: {
  roomId: string;
  ownerId: number;
  userId: number;
}) {
  const [socket] = useSocket(null, "chat");
  const router = useRouter();
  const [showChangeModal, setShowChangeModal] = useState<Boolean>(false);

  const onClickExitRoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    /**
     * 방 폭파
     * axois.get/post('/api/폭파').then(()=> {
     * socket.emit('방폭파')
     * })
     */
    console.log("방 폭파!");
  }, []);

  const onClickChangePWAndName = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      /**
       * 방 바꾸는 모달 보여주고,
       * 그 모달안에서 axios로 방 이름, 패스워드 변경
       */
      console.log("셋팅 화면 출력");
      setShowChangeModal(true);
    },
    []
  );

  useEffect(() => {
    socket?.on("방 폭파", () => {
      //  방에서 쫓겨나도록
      router.push("/chat");
    });
    socket?.on("방이름변경", () => {
      mutate(`/api/chatroom/${roomId}`);
    });
    return () => {
      socket?.off("방 폭파");
    };
  }, []);

  if (!socket) return <Loading />;
  return (
    <div>
      {showChangeModal && (
        <div className="modal-background">
          <ChangeNameAndPW
            setShowChangeModal={setShowChangeModal}
            roomId={roomId}
          />
        </div>
      )}
      <div className="box">
        <div className="div-button" onClick={onClickExitRoom}>
          <h1>Exit the room</h1>
        </div>
        {ownerId === userId ? (
          <div className="div-button" onClick={onClickChangePWAndName}>
            <h1>Change RoomName / Password</h1>
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .modal-background {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1;
        }
        .div-button {
          border: 1px solid black;
        }
        .box {
          font-family: "Fragment Mono";
          position: absolute;
          top: 160px;
          right: 300px;

          width: 340px;
          height: auto;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
          cursor: pointer;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          font-weight: bold;
        }
        hr {
        }
      `}</style>
    </div>
  );
}
