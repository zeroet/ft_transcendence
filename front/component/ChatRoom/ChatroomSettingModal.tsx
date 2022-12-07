import axios from "axios";
import React, { useCallback, useState } from "react";
import { mutate } from "swr";
import ChangeNameAndPW from "./ChatroomSettingModal/ChangeNameAndPW";

export default function ChatroomSettingModal({ roomId }: { roomId: string }) {
  const [showChangeModal, setShowChangeModal] = useState<Boolean>(false);

  const onClickExitRoom = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .delete(`/api/chatroom/${roomId}`)
        .then((res) => {
          mutate("/api/chatroom");
        })
        .catch((err) => console.log(err));
    },
    []
  );

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

  return (
    <div>
      {showChangeModal && (
        <ChangeNameAndPW
          setShowChangeModal={setShowChangeModal}
          roomId={roomId}
        />
      )}
      <div className="box">
        <div className="div-button" onClick={onClickExitRoom}>
          <h1>Exit the room</h1>
        </div>
        <div className="div-button" onClick={onClickChangePWAndName}>
          <h1>Change Password</h1>
        </div>
      </div>
      <style jsx>{`
        .div-button {
          border: 1px solid black;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: absolute;
          top: 160px;
          right: 300px;

          width: 240px;
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
