import axios from "axios";
import { GetServerSideProps } from "next";
import cookies from "next-cookies";
import useSWR from "swr";
import FriendStatus from "../../component/Home/FriendStatus";
import Profile from "../../component/Home/Profile";
import TwoFactorModal from "../../component/Home/TwoFactorModal";
import Layout from "../../component/Layout";
import Title from "../../component/Title";

const FriendProfile = ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: number;
}) => {
  const { data, error } = useSWR("/api/users");

  if (!data) return;
  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
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
        <Profile id={id} />
        <FriendStatus id={id} />
      </div>
    </Layout>
  );
};

export default FriendProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken } = cookie;
  const { id } = context.query;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { accessToken, id } };
};
