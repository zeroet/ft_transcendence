import { useRouter } from "next/router";
import ChatBody from "../../component/Chat/ChatBody";
import Participant from "../../component/Chat/Participant";
import RoomList from "../../component/Chat/RoomList";
import Layout from "../../component/Layout";
import Title from "../../component/Title";

export default function PageDmRoom() {
    const router = useRouter();
    console.log(router);
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