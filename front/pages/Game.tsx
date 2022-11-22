import cookies from "next-cookies";
import GameBody from "../component/Game/GameBody";
import GameList from "../component/Game/GameList";
import Layout from "../component/Layout";
import Title from "../component/Title";
import tokenManager from "../component/Utils/tokenManager";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Loading from "../component/errorAndLoading/Loading";
import useSocket from "../component/Utils/socket";

export default function Game({ accessToken }: { accessToken: string }) {
  const [socket, disconnet] = useSocket(accessToken, "game");

  if (socket) {
    console.log("game body", socket.id);
  }
  if (!socket) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      <div>
        <GameList accessToken={accessToken} />
        <GameBody accessToken={accessToken} />
        <style jsx>{`
          div {
            display: grid;
            grid-template-columns: 1fr 3fr;
          }
        `}</style>
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
  return {
    props: {
      accessToken,
    },
  };
}
