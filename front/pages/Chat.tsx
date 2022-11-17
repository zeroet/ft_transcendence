import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";
import cookies from "next-cookies";
import tokenManager from "../component/Utils/tokenManager";

export default function Chat() {
  return (
    <Layout>
      <Title title="Chat" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 4fr 2fr" }}>
        <RoomList />
        <ChatBody />
        <Participant />
      </div>
    </Layout>
  );
}

export function getServerSideProps(context: any) {
  const cookie = cookies(context);
  if (JSON.stringify(cookie) === '{}') {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  tokenManager(cookie);
  return { props: {} };
}
