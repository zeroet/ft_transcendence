import FriendStatus from "../component/Home/FriendStatus";
import Layout from "../component/Layout";
import Profile from "../component/Home/Profile";
import Title from "../component/Title";
import cookies from "next-cookies";
import useSWR from "swr";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import axios from "axios";
import { GetServerSideProps } from "next";
import useSocket from "../component/Utils/socket";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const { data, error } = useSWR("/api/users");
  const [socketGame] = useSocket(accessToken, "game");
  const [socketChat] = useSocket(accessToken, "chat");

  console.log(socketChat?.id, "is socket id of Chat");
  console.log(socketGame?.id, "is socket id of Game");

  useEffect(() => {
    router.replace(router.asPath);
  }, []);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data || !socketChat || !socketGame) return <Loading />;
  return (
    <Layout>
      <Title title="Home" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1.2fr",
          minHeight: "600px",
        }}
      >
        <Profile id={data.id} />
        <FriendStatus id={data.id} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { accessToken } };
};
