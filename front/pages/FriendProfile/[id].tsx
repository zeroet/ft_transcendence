import { GetServerSideProps } from "next";
import cookies from "next-cookies";
import useSWR from "swr";
import FriendStatus from "../../component/Home/FriendStatus";
import Profile from "../../component/Home/Profile";
import Layout from "../../component/Layout";
import Title from "../../component/Title";

const FriendProfile = ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  console.log(id);
  return (
    <Layout>
      <Title title="Home" />
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
