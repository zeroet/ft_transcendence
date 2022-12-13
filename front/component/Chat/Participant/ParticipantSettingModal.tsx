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
  chatId: string | null;
}) => {
  const router = useRouter();
  const { data: myData, error: myError } = useSWR("/api/users");
  const { data: blockedListData, error: blockedListError } = useSWR(
    chatId ? "/api/users/block/list" : null
  );
  const [isBlock, setIsBlock] = useState<string>("Block");
  const { data: chatroomData, error: chatroomError } = useSWR(
    chatId ? `/api/chatroom/${chatId}/members` : null
  );

  const onClickProfile = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/FriendProfile/${userId.toString()}`);
    },
    [userId]
  );

  const onClickDM = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .post(`/api/dm/${userId}`)
        .then(async (res) => {
          return await res.data.id;
        })
        .then((id) => {
          router.push({
            pathname: "/Chat",
            query: {
              id: id,
              link: "dm",
            },
          });
        })
        .catch((err) => {
          console.log(err);
          router.push("/Chat");
        });
      setShowModal(false);
    },
    [userId]
  );

  const onClickGame = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
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

  const onClickMute = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .patch(`/api/chatroom/${chatId}/participants/update`, {
          targetUserId: userId,
          mute: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      setShowModal(false);
    },
    [chatroomData, userId, myData]
  );

  const onClickBan = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .patch(`/api/chatroom/${chatId}/participants/update`, {
          targetUserId: userId,
          ban: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      setShowModal(false);
    },
    [chatroomData, userId, myData]
  );

  const onClickKick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .patch(`/api/chatroom/${chatId}/members/update`, {
          targetUserId: userId,
          kick: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      setShowModal(false);
    },
    [chatroomData, myData, userId]
  );

  const onClickSetAdmin = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .patch(`/api/chatroom/${chatId}/admin`, {
          targetUserId: userId,
        })
        .then(() => {
          setShowModal(false);
        })
        .catch((err) => console.log(err));
    },
    [myData, userId]
  );

  const onClickDelete = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await axios
        .delete(`/api/users/friend/${userId}`)
        .then(() => {
          mutate(`/api/users/friend/list`);
        })
        .catch((err) => console.log(err));
      setShowModal(false);
    },
    [myData, userId]
  );

  useEffect(() => {
    if (!myData || !blockedListData) return;
    blockedListData.map((element: any) => {
      console.log(element.blockedUserId);
      if (element.blockedUserId === userId) {
        setIsBlock("Unblock");
      }
    });
  }, [myData, blockedListData]);

  if (!myData || (chatId && (!blockedListData || !chatroomData)))
    return <Loading />;
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
      {chatId && (
        <div className="router-div" onClick={onClickBlock}>
          {isBlock}
        </div>
      )}
      {!chatId && (
        <div className="router-div" onClick={onClickDelete}>
          Delete
        </div>
      )}
      {isOwner && (
        <div>
          <div className="router-div" onClick={onClickMute}>
            Mute
          </div>
          <div className="router-div" onClick={onClickKick}>
            Kick
          </div>
          <div className="router-div" onClick={onClickBan}>
            Ban
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
          width: 101px;
          text-transform: uppercase;
          font-size: 15px;
          background-color: white;
          box-shadow: 10px 10px 2px 2px;
          overflow: visible;
        }
        .router-div {
          background-color: white;
          border: 1px solid black;
          width: 100px;
          text-align: center;
          transition: width 0.5s, height 0.5s, background-color 0.5s,
            transform 0.5s;
          cursor: pointer;
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
