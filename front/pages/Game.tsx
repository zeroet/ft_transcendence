import cookies from "next-cookies";
import GameBody from "../component/Game/GameBody";
import GameList from "../component/Game/GameList";
import Layout from "../component/Layout";
import Title from "../component/Title";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function Game({
  accessToken,
  isOwner,
}: {
  accessToken: string;
  isOwner: string | null;
}) {
  const { data, error } = useSWR("/api/users");

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <Layout>
      <Title title="Game" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div>
        <GameList accessToken={accessToken} />
        <GameBody accessToken={accessToken} isOwner={isOwner} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  const { isOwner } = context.query;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      accessToken,
      isOwner: isOwner ? isOwner : null,
    },
  };
};
