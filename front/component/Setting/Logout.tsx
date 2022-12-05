import axios from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { mutate } from "swr";
import useSocket from "../Utils/socket";

const Logout = () => {
  const router = useRouter();
  const [, disconnetGame] = useSocket(null, "game");
  const [, disconnetChat] = useSocket(null, "chat");

  const logout = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await axios.post("/api/two-factor/valid", {
        valid: false,
      });
      mutate("/api/users");
      await axios.get("/api/auth/logout", {
        headers: { "Cache-Control": "no-cache" },
      });
      // 로그아웃시 소켓 삭제
      disconnetGame();
      disconnetChat();
      router.push("/");
    } catch (e) {
      console.log(e);
      await axios.get("/api/auth/refresh").catch((e) => console.log(e));
    }
  }, []);

  return (
    <div onClick={logout} className="setting-component">
      <div className="div-lettre">Logout</div>
      <style jsx>{`
        .div-lettre {
          font-family: "Fragment Mono", monospace;
          font-weight: bold;
          overflow: visible;
          width: 100%;
          height: 100%;
          text-transform: uppercase;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Logout;
