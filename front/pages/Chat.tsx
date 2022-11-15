import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";

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
