import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import fetcher from "../component/Utils/fetcher";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookies from "next-cookies";
import { GetServerSideProps } from "next";
import useSocket from "../component/Utils/socket";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [gameSocket] = useSocket(pageProps.accessToken, "game");

  useEffect(() => {
    gameSocket?.on("test", () => {
      const response = confirm("get test siginal");
      /**
       * if response === ok, emit ok
       */
    });
    return () => {
      gameSocket?.off("test");
    };
  }, [gameSocket?.id]);

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
