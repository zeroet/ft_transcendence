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

  if (userError || roomError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData || !roomData || !socket) return <Loading />;
  return (
    <div>
      <Layout>
        <Title title="ChatRoom" />
        {userData.two_factor_activated && !userData.two_factor_valid && (
          <TwoFactorModal />
        )}
        {/* {roomData && roomData.password && showPWModal && <PWModal />} */}
        <div className="component-style">
          <RoomList accessToken={accessToken} />
          <ChatRoomBody chatroomId={id} />
          <Participant />
        </div>
      </Layout>
      <style jsx>{`
        .component-style {
          display: grid;
          grid-template-columns: 2fr 4fr 2fr;
        }
      `}</style>
    </div>
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
