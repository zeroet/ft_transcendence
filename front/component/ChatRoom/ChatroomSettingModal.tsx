// 방 관리자일때와 아닐때를 나눠야함.
// 우선 일반적인 경우 -> exit the room 만 기본설정으로

import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function ChatroomSettingModal() {
  const [socket] = useSocket(null, "chat");
  const router = useRouter();

  const onClickExitRoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    /**
     * 방 폭파
     * axois.get/post('/api/폭파').then(()=> {
     * socket.emit('방폭파')
     * })
     */
  }, []);

  const onClickChangePW = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    /**
     * 방 바꾸는 모달 보여주고,
     * 그 모달안에서 axios로 방 이름, 패스워드 변경
     */
  }, []);

  useEffect(() => {
    socket?.on("방 폭파", () => {
      //  방에서 쫓겨나도록
      router.push("/chat");
    });
    return () => {
      socket?.off("방 폭파");
    };
  }, []);

  if (!socket) return <Loading />;
  return (
    <div>
      <div className="box">
        <div className="div-button" onClick={onClickExitRoom}>
          <h1>Exit the room</h1>
        </div>
        <div className="div-button" onClick={onClickChangePW}>
          <h1>Change Password</h1>
        </div>
      </div>
      <style jsx>{`
        .div-button {
          border: 1px solid black;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: absolute;
          top: 130px;
          right: 300px;

          width: 240px;
          height: auto;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
          cursor: pointer;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          font-weight: bold;
        }
        hr {
        }
      `}</style>
    </div>
  );
}
