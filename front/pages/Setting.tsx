import cookies from "next-cookies";
import Layout from "../component/Layout";
import ChangeAvatar from "../component/Setting/ChangeAvatar";
import ChangeName from "../component/Setting/ChangeName";
import Logout from "../component/Setting/Logout";
import TwoFactor from "../component/Setting/TwoFactor";
import Title from "../component/Title";
import tokenManager from "../component/Utils/tokenManager";
import styles from "../styles/LayoutBox.module.css";

export default function Setting() {
  return (
    <Layout>
      <Title title="Setting" />
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
            // background-color: green;
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

export function getServerSideProps(context: any) {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (!(accessToken)) {
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
