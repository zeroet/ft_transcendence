import axios from "axios";
import cookies from "next-cookies";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Enter({ path }: { path: string }) {
  const router = useRouter();
  const onClickLink = async (e: React.MouseEvent<HTMLDivElement>) => {
    await axios
      .get(path, {
        headers: {
          "Cache-Control": "max-age=0",
        },
      })
      .then((res) => {
        router.push("/Home");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <Head>
        <title>ft_transcendence</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        {path === "/api/auth/login" ? (
          <div onClick={onClickLink}>
            <img src="/images/Group.png" alt="enterImg" className="enterImg" />
          </div>
        ) : (
          <Link href={path}>
            <img src="/images/Group.png" alt="enterImg" className="enterImg" />
          </Link>
        )}
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
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (accessToken && refreshToken) {
    return {
      redirect: {
        destination: "/Home",
        permanent: false,
      },
    };
  } else if (!accessToken && !refreshToken) {
    return {
      props: {
        path: "/api/auth/signup",
      },
    };
  }
  return {
    props: { path: "/api/auth/login" },
  };
}
