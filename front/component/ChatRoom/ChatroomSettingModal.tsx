import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../errorAndLoading/Loading";
import ChangeNameAndPW from "./ChatroomSettingModal/ChangeNameAndPW";

export default function ChatroomSettingModal({
  roomId,
  isOwner,
}: {
  roomId: string;
  isOwner: Boolean;
}) {
  const router = useRouter();
  const [showChangeModal, setShowChangeModal] = useState<Boolean>(false);
  const { data: participantData } = useSWR(
    `/api/chatroom/${roomId}/participants`
  );
  const { data: myData } = useSWR("/api/users");

  const onClickDeleteRoom = useCallback(
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
    [roomId]
  );

  const onClickChangePWAndName = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowChangeModal(true);
    },
    [roomId]
  );

  const onClickExitRoom = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOwner) {
        if (participantData.length === 1) {
          onClickDeleteRoom(e);
        } else {
          if (participantData[0].userId !== myData.id) {
            await axios
              .patch(`/api/chatroom/${roomId}/owner`, {
                targetUserId: participantData[0].userId,
              })
              .then(() => {})
              .catch((err) => console.log(err));
          } else {
            await axios
              .patch(`/api/chatroom/${roomId}/owner`, {
                targetUserId: participantData[1].userId,
              })
              .then(() => {})
              .catch((err) => console.log(err));
          }
        }
      }
      await axios
        .delete(`/api/chatroom/${roomId}/participants`)
        .then((res) => {
          router.push("/Chat");
        })
        .catch((err) => console.log(err));
    },
    [roomId, myData]
  );

  if (!participantData || !myData) return <Loading />;
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
        {isOwner && (
          <div className="div-button" onClick={onClickDeleteRoom}>
            <h1>Delete the room</h1>
          </div>
        )}
        {isOwner && (
          <div className="div-button" onClick={onClickChangePWAndName}>
            <h1>Change Room name / Password</h1>
          </div>
        )}
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
          font-family: "Fragment Mono", monospace;
          position: absolute;
          top: 160px;
          right: 300px;

          width: 300px;
          height: auto;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
          cursor: pointer;
        }
        h1 {
          font-size: 17px;
          text-align: center;
          font-weight: bold;
        }
        hr {
        }
      `}</style>
    </div>
  );
}
