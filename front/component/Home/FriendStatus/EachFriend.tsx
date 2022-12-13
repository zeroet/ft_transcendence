import React, { useCallback, useState } from "react";
import ParticipantSettingModal from "../../Chat/Participant/ParticipantSettingModal";

export const EachFriend = ({
  color,
  friendUsername,
  id,
}: {
  color: string;
  friendUsername: string;
  id: number;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const onClickShowModal = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowModal((curr) => !curr);
    },
    [showModal, color, friendUsername, id]
  );

  return (
    <div>
      <div className="friend" onClick={onClickShowModal}>
        <div className="status" style={{ backgroundColor: color }}></div>
        <div>{friendUsername}</div>
      </div>
      {showModal && (
        <ParticipantSettingModal
          isOwner={false}
          userId={id}
          setShowModal={setShowModal}
          chatId={null}
        />
      )}
      <style jsx>{`
        .friend {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};