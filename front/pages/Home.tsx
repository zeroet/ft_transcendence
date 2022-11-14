import FriendStatus from "../component/FriendStatus";
import Layout from "../component/Layout";
import Profile from "../component/Profile";
import Title from "../component/Title";

export default function Home() {
  return (
    <Layout>
      <Title title="Home" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          minHeight: "600px",
        }}
      >
        <Profile />
        <FriendStatus />
      </div>
    </Layout>
  );
}
