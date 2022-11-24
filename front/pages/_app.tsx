import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import fetcher from "../component/Utils/fetcher";
// import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          if (error) {
            // axios.get("/api/auth/refresh");
            console.log("here is _app", error);
          }
        },
        fetcher: fetcher,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
