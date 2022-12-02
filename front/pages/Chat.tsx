import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";
import cookies from "next-cookies";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";
import useSocket from "../component/Utils/socket";
import { useEffect, useState } from "react";
import fetcher from "../component/Utils/fetcher";
import PWModal from "../component/ChatRoom/PWModal";
import ChatRoomBody from "../component/ChatRoom/ChatRoomBody";
import { TypeChatId } from "../interfaceType";

export default function Chat({
  accessToken,
  id,
}: {
  accessToken: string;
  id: TypeChatId;
}) {
  const isId = Object.keys(id).length !== 0;
  const { data: userData, error: userError } = useSWR("/api/users");
  const { data: roomData, error: roomError } = useSWR(
    isId ? `/api/${id.link}/${id.id}` : null,
    isId ? fetcher : null
  );
  const [socket] = useSocket(accessToken, "chat");
  const [showPWModal, setShowPWModal] = useState<boolean>(true);

  // 룸 데이터 이동 확인용, 모달용
  useEffect(() => {
    if (roomData && userData) {
      console.log(`i am in room ${roomData.chatroomName}`);
      axios
        .post(`/api/${id.link}/${id.id}/members`)
        .then(() => {
          mutate(`/api/${id.link}/${id.id}/members`);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      if (roomData) {
        console.log(`1 am out room ${roomData.chatroomName}`);
        axios
          .delete(`/api/${id.link}/${id.id}/members`)
          .then(() => {
            mutate(`/api/${id.link}/${id.id}/members`);
          })
          .catch((err) => console.log(err));
      }
      setShowPWModal(true);
    };
  }, [roomData, id?.id]);

  if (userError || (id.id && roomError))
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData || (id.id && !roomData) || !socket) return <Loading />;
  return (
    <Layout>
      <Title title="ChatRoom" />
      {userData.two_factor_activated && !userData.two_factor_valid && (
        <TwoFactorModal />
      )}
      {isId &&
        roomData &&
        roomData.isPrivate &&
        showPWModal &&
        roomData.ownerId !== userData.id && (
          <div className="pwmodal-background">
            <PWModal setShowPWModal={setShowPWModal} roomId={roomData.id} />
          </div>
        )}
      <div className="component-style">
        {/* ///////////////////////////////////////// */}
        {/* 리스트 부분 */}
        <RoomList accessToken={accessToken} />
        {/* <dmList /> */}
        {/* ///////////////////////////////////////// */}

        {/* ///////////////////////////////////////// */}
        {/* 채팅 바디부분 */}
        {!isId && <ChatBody />}
        {/* 채팅룸 */}
        {isId && id.link === "chatroom" && <ChatRoomBody id={id} />}
        {/* DM */}
        {/* {isId && id.link === "dm" && <ChatRoomBody chatroomId={id.id} />} */}
        {/* ///////////////////////////////////////// */}

        {/* ///////////////////////////////////////// */}
        {/* 참가자 부분 */}
        {!isId && <Participant id={id} ownerId={null} />}
        {isId && id.link === "chatroom" && roomData && (
          <Participant id={id} ownerId={roomData.ownerId} />
        )}
        {/* {isId && id.link === "dm" && (
          <Participant id={id} ownerId={roomData.ownerId} />
        )} */}
        {/* ///////////////////////////////////////// */}
      </div>
      <style jsx>{`
        .pwmodal-background {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1;
        }
        .component-style {
          display: grid;
          grid-template-columns: 2fr 4fr 2fr;
        }
      `}</style>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  const id = context.query;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // tokenManager(cookie);
  return { props: { accessToken, id } };
};
