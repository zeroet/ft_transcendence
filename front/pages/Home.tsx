import FriendStatus from "../component/Home/FriendStatus";
import Layout from "../component/Layout";
import Profile from "../component/Home/Profile";
import Title from "../component/Title";

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Title title="Home" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1.2fr",
          minHeight: "600px",
        }}
      >
        <Profile />
        <FriendStatus />
      </div>
    </Layout>
  );
}
