import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";

const ParticipantSettingModal = ({
  isOwnerMydata,
  userId,
  setShowModal,
  chatId,
  isAdminParticipant,
  isAdminMyData,
  ownerId,
}: {
  isOwnerMydata: boolean;
  userId: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: string | null;
  isAdminParticipant: boolean;
  isAdminMyData: boolean;
  ownerId: number | null;
}) => {
  const router = useRouter();
  const { data: myData, error: myError } = useSWR("/api/users");
  const { data: blockedListData, error: blockedListError } = useSWR(
    "/api/users/block/list"
  );
  const [isBlock, setIsBlock] = useState<string>("Block");
  const [isSetAdmin, setIsSetAdmin] = useState<string>("Set Admin");
  const { data: chatroomData, error: chatroomError } = useSWR(
    chatId ? `/api/chatroom/${chatId}/members` : null
  );
  const [gameSocket] = useSocket(null, "game");

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
    gameSocket?.emit("privateQ", userId);
    setShowModal(false);
  }, []);

  const onClickBlock = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isBlock === "Block") {
        const userBlocked = chatroomData.find((e: any) => e.userId === userId);
        await axios
          .post(`/api/users/block/${userId}`)
          .then(() => {
            setIsBlock("Unblock");
            mutate("/api/users/block/list");
            setShowModal(false);
            toast.info(
              `You just blocked ${userBlocked.User.username} from chat`,
              {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: false,
                pauseOnHover: true,
              }
            );
          })
          .catch((err) => console.log(err));
      } else {
        const userBlocked = chatroomData.find((e: any) => e.userId === userId);
        if (blockedListData.length === 0) {
          setIsBlock("Block");
          return;
        }
        await axios
          .delete(`/api/users/block/${userId}`)
          .then((res) => {
            setIsBlock("Block");
            mutate("/api/users/block/list");
            setShowModal(false);
            toast.info(
              `You just unblocked ${userBlocked.User.username} from chat`,
              {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: false,
                pauseOnHover: true,
              }
            );
          })
          .catch((err) => console.log(err));
      }
    },
    [isBlock, blockedListData, myData, userId, chatId]
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
        .then(() => {})
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
        .then(() => {})
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
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
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
          isAdmin: isAdminParticipant ? false : true,
        })
        .then(() => {
          if (isAdminParticipant) {
            setIsSetAdmin("Unset Admin");
          } else {
            setIsSetAdmin("Set Admin");
          }
        })
        .catch((err) => console.log(err));
    },
    [chatroomData, userId, isAdminParticipant]
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
      if (element.blockedUserId === userId) {
        setIsBlock("Unblock");
      }
    });
    if (isAdminParticipant) {
      setIsSetAdmin("Unset Admin");
    } else {
      setIsSetAdmin("Set Admin");
    }
  }, [myData, blockedListData, chatId, isAdminParticipant]);

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
      {(isOwnerMydata || isAdminMyData) && ownerId != userId && (
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
          {isOwnerMydata && (
            <div className="router-div" onClick={onClickSetAdmin}>
              {isSetAdmin}
            </div>
          )}
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
          box-shadow: 5px 10px;
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
