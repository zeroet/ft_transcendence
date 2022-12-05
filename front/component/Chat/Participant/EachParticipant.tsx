import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import useSWR from "swr";
import ParticipantSettingModal from "./ParticipantSettingModal";

const EachParticipant = ({
  username,
  userId,
  isOwner,
}: {
  username: string;
  userId: number;
  isOwner: boolean;
}) => {
  const { data: myData, error: myError } = useSWR(`/api/users`);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onClickEachParticipant = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (myData.username === username) return;

      setShowModal((curr) => !curr);
      // 프로필  용 (모달 안에 넣기)
      // router.push(`/FriendProfile/${userId}`);
    },
    []
  );
  console.log(
    "Each participant에서 userId는 유저정보를 불러오거나 API를 사용할때! 위함"
  );
  return (
    <div className="user">
      <div onClick={onClickEachParticipant}># {username}</div>
      {showModal && (
        <ParticipantSettingModal isOwner={isOwner} userId={userId} />
      )}
      <style jsx>{`
        .user {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default EachParticipant;
