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
    gameSocket?.on("createQ", (senderId: number, senderName: string) => {
      if (senderId) {
        alert(`${senderName}이 게임신청함 : 경은아 이거 토스트로 수정해줘`);
        gameSocket?.emit("Private", senderId);
      }
    });

    gameSocket?.on("privateRoom", (obj: { isOwner: boolean }) => {
      router.push({
        pathname: "/Game",
        query: {
          isOwner: obj.isOwner ? "owner" : "player",
        },
      });
    });

  

    gameSocket?.on("Pcancel", () => {
      router.back();
    });
    //Logout
    gameSocket?.on("Logout", () => {
      alert('USER STATUS LOGOUT')
    });
    // IsPlaying
    gameSocket?.on("IsPlaying", () => {
      alert("너가 신청한 플레이어는 게임중임");
    });
    return () => {

      gameSocket?.off("createQ");
      gameSocket?.off("privateRoom");
      gameSocket?.off("Pcancel");
      gameSocket?.off("IsPlaying");
      gameSocket?.off("Logout");
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
  if (accessToken) {
    const [gameSocket] = useSocket(accessToken, "game");
  }
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
