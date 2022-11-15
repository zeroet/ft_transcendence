import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Enter() {
  // const router = useRouter();
  const getUserData = async () => {
    //   axios
    //     .get("/api/auth/login")
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err));
  };
  // const go = () => {
  //   router.push("/api/auth/login");
  // };
  return (
    <div>
      <Head>
        <title>ft_transcendence</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <button onClick={go}>~~~~~~~~~</button> */}
      <div>
        <Link href="Login">
          <img
            onClick={getUserData}
            src="/images/Group.png"
            alt="enterImg"
            className="enterImg"
          />
        </Link>
        <style jsx>{`
          div {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .enterImg {
            height: 150px;
          }
        `}</style>
      </div>
    </div>
  );
}

export function getServerSideProps(context: any) {
  console.log(context.req.headers.cookie);
  return {
    props: {},
  };
}
