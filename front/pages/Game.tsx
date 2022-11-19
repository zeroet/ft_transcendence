import cookies from "next-cookies";
import GameBody from "../component/Game/GameBody";
import GameList from "../component/Game/GameList";
import Layout from "../component/Layout";
import Title from "../component/Title";
import tokenManager from "../component/Utils/tokenManager";

export default function Game() {
  return (
    <Layout>
      <Title title="Game" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
        <GameList />
        <GameBody />
      </div>
    </Layout>
  );
}

export function getServerSideProps(context: any) {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (!(accessToken)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  tokenManager(cookie)
  return { props: {} };
}
