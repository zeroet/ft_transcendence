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
import { useEffect, useState } from "react";
import fetcher from "../component/Utils/fetcher";
import PWModal from "../component/ChatRoom/PWModal";
import ChatRoomBody from "../component/ChatRoom/ChatRoomBody";
import { TypeChatId } from "../interfaceType";
import Header from "../component/Header/Header";
import DMRoomBody from "../component/DM/DMRoomBody";
import ParticipantDm from "../component/DM/ParicipantDm";

export default function Chat({
  id,
  accessToken,
}: {
  id: TypeChatId;
  accessToken: string;
}) {
  const isId = Object.keys(id).length !== 0;
  const { data: userData, error: userError } = useSWR("/api/users");
  const { data: roomData, error: roomError } = useSWR(
    isId && id.link === "chatroom" ? `/api/${id.link}/${id.id}` : null,
    isId && id.link === "chatroom" ? fetcher : null
  );
  const [showPWModal, setShowPWModal] = useState<boolean>(true);

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
  }, [roomData?.id, id?.id]);

  if (userError || (id.link === "chat" && roomError))
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData || (id.link === "chat" && !roomData)) return <Loading />;
  return (
    <Layout>
      <Header id={id} />
      <Title title="Chat" />
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
        <RoomList />
        {!isId && <ChatBody />}
        {isId && id.link === "chatroom" && <ChatRoomBody id={id} />}
        {isId && id.link === "dm" && <DMRoomBody id={id} />}
        {!isId && (
          <Participant id={id} ownerId={null} accessToken={accessToken} />
        )}
        {isId && id.link === "chatroom" && roomData && (
          <Participant
            id={id}
            ownerId={roomData.ownerId}
            accessToken={accessToken}
          />
        )}
        {isId && id.link === "dm" && <ParticipantDm id={id} />}
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
  return { props: { id, accessToken } };
};
