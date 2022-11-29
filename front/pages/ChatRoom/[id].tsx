import Layout from "../../component/Layout";
import Participant from "../../component/Chat/Participant";
import RoomList from "../../component/Chat/RoomList";
import Title from "../../component/Title";
import cookies from "next-cookies";
import Loading from "../../component/errorAndLoading/Loading";
import TwoFactorModal from "../../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";
import useSocket from "../../component/Utils/socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChatRoomBody from "../../component/ChatRoom/ChatRoomBody";
import PWModal from "../../component/ChatRoom/PWModal";

export default function Chat({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) {
  const { data: userData, error: userError } = useSWR("/api/users");
  // roomData를 가지고, 오너가 볼수있는 모달을 추가하고, 비밀번호 추가하고
  const { data: roomData, error: roomError } = useSWR(`/api/chatroom/${id}`);
  const [socket] = useSocket(accessToken, "chat");
  const [showPWModal, setShowPWModal] = useState<boolean>(true);

  /**
   * 패스워드 모달! 라우팅으로 룸 데이터가 바뀌는순간, 리랜더를 발생시켜
   * setShowPWModal을 true로 리셋
   */
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
  }, [roomData]);

  if (userError || roomError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData || !roomData || !socket) return <Loading />;
  return (
    <Layout>
      <Title title="ChatRoom" />
      {userData.two_factor_activated && !userData.two_factor_valid && (
        <TwoFactorModal />
      )}
      {roomData && roomData.password && showPWModal && (
        <PWModal setShowPWModal={setShowPWModal} password={roomData.password} />
      )}
      <div className="component-style">
        <RoomList accessToken={accessToken} />
        <ChatRoomBody chatroomId={id} />
        <Participant />
      </div>
      <style jsx>{`
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
  const { id } = context.query;
  const { accessToken } = cookie;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { accessToken, id } };
};
