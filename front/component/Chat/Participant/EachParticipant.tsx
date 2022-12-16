import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../../errorAndLoading/Loading";
import ParticipantSettingModal from "./ParticipantSettingModal";

const EachParticipant = ({
  username,
  userId,
  isOwner,
  chatId,
  color,
  isAdminParticipant,
  isAdminMyData,
}: {
  username: string;
  userId: number;
  isOwner: boolean;
  chatId: string;
  color: string;
  isAdminParticipant: boolean;
  isAdminMyData: boolean;
}) => {
  const { data: myData } = useSWR(`/api/users`);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onClickEachParticipant = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (myData.username === username) return;
      setShowModal((curr) => !curr);
    },
    [myData, chatId]
  );

  return (
    <div>
      <div className="user">
        <div
          style={{
            backgroundColor: color,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            marginRight: "5px",
          }}
        ></div>
        <div onClick={onClickEachParticipant} className="username">
          {username}
        </div>
      </div>
      {showModal && (
        <ParticipantSettingModal
          isOwner={isOwner}
          userId={userId}
          setShowModal={setShowModal}
          chatId={chatId}
          isAdminParticipant={isAdminParticipant}
          isAdminMyData={isAdminMyData}
        />
      )}
      <style jsx>{`
        .user {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .username {
          font-weight: ${username === myData.username ? "bold" : "normal"};
        }
      `}</style>
    </div>
  );
};

export default EachParticipant;
