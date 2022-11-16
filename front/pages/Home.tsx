import FriendStatus from "../component/Home/FriendStatus";
import Layout from "../component/Layout";
import Profile from "../component/Home/Profile";
import Title from "../component/Title";
import { TokenType } from "../interfaceType";
import axios from "axios";

export default function Home({ token, refresh }: TokenType): JSX.Element {
  // console.log(token)
  // console.log(refresh)

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
        <Profile />
        <FriendStatus />
      </div>
    </Layout>
  );
}

export function getServerSideProps(context: any) {
  const cookie = context.req.headers.cookie;
  if (!cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log(cookie)
  const [token, refresh] = cookie.split("; ");
  console.log('auth', token)
  return {
    props: { token, refresh },
  };
}
