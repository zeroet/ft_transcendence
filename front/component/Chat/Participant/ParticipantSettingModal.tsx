import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
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

  const onClickSetAdmin = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
    console.log("Set Admin");
  }, []);

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
