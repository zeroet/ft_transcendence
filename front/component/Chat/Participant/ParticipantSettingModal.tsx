import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";

const ParticipantSettingModal = ({
  isOwner,
  userId,
  setShowModal,
  chatId,
}: {
  isOwner: boolean;
  userId: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: string;
}) => {
  const router = useRouter();
  const { data: myData, error: myError } = useSWR("/api/users");
  const { data: blockedListData, error: blockedListError } = useSWR(
    "/api/users/block/list"
  );
  const [isBlock, setIsBlock] = useState<string>("Block");

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
      if (isBlock === "Block") {
        await axios
          .post(`/api/users/block/${userId}`)
          .then((res) => {
            mutate("/api/users/block/list");
            setIsBlock("Unblock");
            setShowModal(false);
          })
          .catch((err) => console.log(err));
      } else {
        if (blockedListData.length === 0) {
          setIsBlock("Block");
          return;
        }
        await axios
          .delete(`/api/users/block/${userId}`)
          .then((res) => {
            mutate("/api/users/block/list");
            setIsBlock("Block");
            setShowModal(false);
          })
          .catch((err) => console.log(err));
      }
    },
    [isBlock, blockedListData, myData, userId]
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

  const onClickSetAdmin = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .patch(`/api/chatroom/${chatId}/admin`, {
          targetUserId: userId,
        })
        .then(() => {
          // mutate("/api/users");
          setShowModal(false);
        })
        .catch((err) => console.log(err));
    },
    [myData, userId]
  );

  useEffect(() => {
    if (!myData || !blockedListData) return;
    console.log(myData);
    console.log(blockedListData);
    blockedListData.map((element: any) => {
      console.log(element.blockedUserId);
      if (element.blockedUserId === userId) {
        setIsBlock("Unblock");
      }
    });
  }, [myData, blockedListData]);

  if (!myData || !blockedListData) return <Loading />;
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
        {isBlock}
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
