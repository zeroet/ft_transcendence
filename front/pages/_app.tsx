import "../styles/globals.css";
import type { AppProps } from "next/app";
import useSWR, { SWRConfig } from "swr";
import fetcher from "../component/Utils/fetcher";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookies from "next-cookies";
import { GetServerSideProps } from "next";
import useSocket from "../component/Utils/socket";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [gameSocket] = useSocket(pageProps.accessToken, "game");
  const router = useRouter();
  const { data: myData } = useSWR("/api/users");

  useEffect(() => {
    gameSocket?.on("createQ", (senderId: number) => {
      const response = confirm("get test siginal");
      if (response) {
        gameSocket?.emit("Private", senderId);
      } else {
        gameSocket?.emit("inviteCancel", senderId);
      }
    });

    gameSocket?.on("privateRoom", (obj: { isOwner: boolean }) => {
      console.log("consolt");
      router.push({
        pathname: "/Game",
        query: {
          isOwner: obj.isOwner ? "owner" : "player",
        },
      });
    });
    return () => {
      gameSocket?.off("createQ");
      gameSocket?.off("privateRoom");
    };
  }, [gameSocket?.id, myData]);

  return (
    <SWRConfig
      value={{
        onError: (error) => {
          if (error) {
            console.log("here is _app", error);
          }
        },
        fetcher: fetcher,
      }}
    >
      <Component {...pageProps} />
      <ToastContainer
        newestOnTop={true}
        theme="colored"
        limit={1}
        style={{ width: "500px", textAlign: "center" }}
        toastStyle={{
          textTransform: "none",
        }}
      />
    </SWRConfig>
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
