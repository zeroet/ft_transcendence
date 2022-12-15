import cookies from "next-cookies";
import Layout from "../component/Layout";
import ChangeAvatar from "../component/Setting/ChangeAvatar";
import ChangeName from "../component/Setting/ChangeName";
import Logout from "../component/Setting/Logout";
import TwoFactor from "../component/Setting/TwoFactor";
import Title from "../component/Title";
import styles from "../styles/LayoutBox.module.css";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function Setting() {
  const { data, error } = useSWR("/api/users");

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <Layout>
      <Title title="Setting" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div className={styles.setting}>
        <div className="dummy"></div>
        <div className="set-list">
          <ChangeName />
          <ChangeAvatar />
          <TwoFactor />
          <Logout />
        </div>
        <div className="dummy"></div>
        <style jsx>{`
          .dummy {
          }
          .set-list {
            // background-color: yellow;
            display: grid;
            grid-template-rows: repeat(4, 1fr);
            justify-items: center;
          }
        `}</style>
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
  // tokenManager(cookie);
  return { props: {} };
};
