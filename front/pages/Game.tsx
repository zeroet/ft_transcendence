import cookies from "next-cookies";
import GameBody from "../component/Game/GameBody";
import GameList from "../component/Game/GameList";
import Layout from "../component/Layout";
import Title from "../component/Title";
import tokenManager from "../component/Utils/tokenManager";
import socketIOClient from "socket.io-client";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Loading from "../component/errorAndLoading/Loading";

export default function Game() {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const socket_game = socketIOClient("http://localhost:8080/game");
    setSocket(socket_game);
    return () => {
      socket_game.disconnect();
    };
  }, []);
  if (!socket) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
        <GameList socket={socket} />
        <GameBody socket={socket} />
      </div>
    </Layout>
  );
}

export function getServerSideProps(context: any) {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (!accessToken) {
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
