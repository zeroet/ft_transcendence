import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import useSWR from "swr";
import Loading from "../../errorAndLoading/Loading";

const ParticipantSettingModal = ({
  isOwner,
  userId,
  setShowModal,
}: {
  isOwner: boolean;
  userId: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { data: myData, error: myError } = useSWR("/api/users");

  const onClickProfile = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/FriendProfile/${userId.toString()}`);
  }, []);

  const onClickDM = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    await axios
      .post(`/api/dm/${userId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(e);
      });
    console.log("DM");
  }, []);

  const onClickGame = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Game");
  }, []);

  const onClickBlock = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("block");
  }, []);

  const onClickMute = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Mute");
  }, []);

  const onClickKick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Kick");
  }, []);

  if (!myData) return <Loading />;
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
          transition: width 2s, height 2s, background-color 2s, transform 2s;
        }
        .router-div:hover {
          background-color: gray;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ParticipantSettingModal;
