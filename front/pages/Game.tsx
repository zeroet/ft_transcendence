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
import Error from "../component/errorAndLoading/Error";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR from "swr";
import fetcher from "../component/Utils/fetcher";

export default function Game({ accessToken }: { accessToken: string }) {
  const { data, error } = useSWR("/api/users", fetcher);
  const [socket, disconnet] = useSocket(accessToken, "game");

  if (socket) {
    socket.on("connect", () => {
      console.log("game", socket.id);
    });
  }

  if (error) return <Error />;
  if (!data || !socket) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
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
