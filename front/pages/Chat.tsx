import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";
import cookies from "next-cookies";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR from "swr";
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
  // roomData를 가지고, 오너가 볼수있는 모달을 추가하고, 비밀번호 추가하고
  const { data: roomData, error: roomError } = useSWR(
    isId ? `/api/chatroom/${id.id}` : null,
    isId ? fetcher : null
  );
  const [socket] = useSocket(accessToken, "chat");
  const [showPWModal, setShowPWModal] = useState<boolean>(true);
  console.log(id);
  // 룸 데이터 이동 확인용, 모달용
  useEffect(() => {
    if (roomData) {
      console.log(`i am in room ${roomData.chatroomName}`);
    }
    return () => {
      if (roomData) {
        console.log(`1 am out room ${roomData.chatroomName}`);
      }
      setShowPWModal(true);
    };
  }, [roomData, isId]);

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
            <PWModal
              setShowPWModal={setShowPWModal}
              password={roomData.password}
            />
          </div>
        )}
      <div className="component-style">
        <RoomList accessToken={accessToken} />
        {/* 일반 화면 */}
        {!isId && <ChatBody />}
        {/* 채팅룸 */}
        {isId && id.link === "chat" && <ChatRoomBody chatroomId={id.id} />}
        <Participant id={id} />
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
