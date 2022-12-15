import { useCallback } from "react";
import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";

const socket: { [key: string]: Socket } = {};

const useSocket = (
  accessToken: string | null,
  socketType: string
): [Socket | undefined, () => void] => {
  
  const disconnect = () => {
    if (socket[socketType]) {
      socket[socketType].disconnect();
      delete socket[socketType];
    }
  };

  if (!socket[socketType] && accessToken) {
    const path = socketType === "chat" ? "/chat" : "/game";
    socket[socketType] = socketIOClient("http://localhost:8080", {
      extraHeaders: {
        accessToken,
      },
      path,
    });
  }
  return [socket[socketType], disconnect];
};

export default useSocket;
