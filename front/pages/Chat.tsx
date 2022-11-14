import ChatBody from "../component/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Participant";
import RoomList from "../component/RoomList";
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
