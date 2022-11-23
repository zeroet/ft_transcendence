import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";
import cookies from "next-cookies";
import tokenManager from "../component/Utils/tokenManager";
import Error from "../component/errorAndLoading/Error";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import fetcher from "../component/Utils/fetcher";
import useSWR from "swr";

export default function Chat() {
  const { data, error } = useSWR("/api/users", fetcher);

  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <Layout>
      <Title title="Chat" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 4fr 2fr" }}>
        <RoomList />
        <ChatBody />
        <Participant />
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
