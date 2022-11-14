import GameBody from "../component/GameBody";
import GameList from "../component/GameList";
import Layout from "../component/Layout";
import Title from "../component/Title";

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
