import { useRouter } from "next/router";
import React, { useCallback } from "react";

const ParticipantSettingModal = ({
  isOwner,
  userId,
}: {
  isOwner: boolean;
  userId: number;
}) => {
  const router = useRouter();

  const onClickProfile = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/FriendProfile/${userId.toString()}`);
  }, []);

  const onClickDM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("DM");
  }, []);

  const onClickGame = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Game");
  }, []);

  const onClickBlock = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("block");
  }, []);

  const onClickMute = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Mute");
  }, []);

  const onClickKick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Kick");
  }, []);

  return (
    <div className="participantSettingModal">
      <div className="router-div" onClick={onClickProfile}>
        Profile
      </div>
      <div className="router-div" onClick={onClickDM}>
        DM
      </div>
      <div className="router-div" onClick={onClickGame}>
        Game
      </div>
      {isOwner && (
        <div>
          <div className="router-div" onClick={onClickBlock}>
            Block
          </div>
          <div className="router-div" onClick={onClickMute}>
            Mute
          </div>
          <div className="router-div" onClick={onClickKick}>
            Kick
          </div>
        </div>
      )}
      <style jsx>{`
        .participantSettingModal {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid black;
          margin: 2px;
        }
        .router-div {
          border: 1px solid black;
          width: 150px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ParticipantSettingModal;
