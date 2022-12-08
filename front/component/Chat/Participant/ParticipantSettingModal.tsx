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
    await axios
      .post(`/api/dm/${userId}`)
      .then((res) => {
        console.log(res, " is axios post : /api/dm/userid");
      })
      .catch((err) => {
        console.log(e);
      });
    // console.log("DM");
    setShowModal(false);
  }, []);

  const onClickGame = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Game");
  }, []);

  const onClickBlock = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(false);
      await axios
        .post(`/api/users/block/${userId}`)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      console.log("block");
    },
    []
  );

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

  const onClickSetAdmin = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Set Admin");
  }, []);

  console.log(myData);
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
      <div className="router-div" onClick={onClickBlock}>
        {myData.Block ? "UnBlock" : "Block"}
      </div>
      {isOwner && (
        <div>
          <div className="router-div" onClick={onClickMute}>
            Mute
          </div>
          <div className="router-div" onClick={onClickKick}>
            Kick
          </div>
          <div className="router-div" onClick={onClickSetAdmin}>
            Set Admin
          </div>
        </div>
      )}
      <style jsx>{`
        .participantSettingModal {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          margin: 2px;
          margin-left: 45px;
          margin-top: -3px;
          //   font-weight: bold;
          text-transform: uppercase;
          font-size: 15px;
          background-color: white;
          box-shadow: 10px 10px 2px 2px;
        }
        .router-div {
          background-color: white;
          border: 1px solid black;
          width: 100px;
          text-align: center;
          transition: width 0.5s, height 0.5s, background-color 0.5s,
            transform 0.5s;
        }
        .router-div:hover {
          background-color: black;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ParticipantSettingModal;
