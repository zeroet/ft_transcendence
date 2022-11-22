import ChatBody from "../../component/Chat/ChatBody";
import Participant from "../../component/Chat/Participant";
import RoomList from "../../component/Chat/RoomList";
import Loading from "../../component/errorAndLoading/Loading";
import Layout from "../../component/Layout";
import Title from "../../component/Title";

export default function PageDmRoom() {
  return (
    <Layout>
      <Title title="DM" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 4fr 2fr" }}>
        <RoomList />
        <ChatBody />
        <Participant />
      </div>
    </Layout>
  );
}
