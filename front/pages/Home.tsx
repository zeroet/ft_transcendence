import FriendStatus from "../component/Home/FriendStatus";
import Layout from "../component/Layout";
import Profile from "../component/Home/Profile";
import Title from "../component/Title";
import cookies from "next-cookies";
import tokenManager from "../component/Utils/tokenManager";
import useSWR from "swr";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import { useRouter } from "next/router";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function Home() {
  const { data, error } = useSWR("/api/users");
  const router = useRouter();

  if (data) {
    console.log(
      "activate",
      data.two_factor_activated,
      "valid",
      data.two_factor_valid
    );
  }
  // SWR Config에 errorRetry 추가방법 찾기
  if (error) axios.get("/api/auth/refresh");
  if (!data) return <Loading />;
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
        {/* {data.two_factor_activated && <TwoFactorModal />} */}
        <Profile />
        <FriendStatus />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};
