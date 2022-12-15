import { useCallback } from "react";
import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";

const socket: { [key: string]: Socket } = {};

const useSocket = (
  accessToken: string | null,
  socketType: string
): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket[socketType]) {
      console.log(
        socket[socketType].id,
        socketType,
        "===================disconnet socket=============="
      );
      socket[socketType].disconnect();
      delete socket[socketType];
    }
  }, [socketType]);

  if (!socket[socketType] && accessToken) {
    const path = socketType === "chat" ? "/chat" : "/game";
    socket[socketType] = socketIOClient("http://localhost:8080", {
      extraHeaders: {
        accessToken,
      },
      path,
    });

    console.log(
      `=================create new socket========================== ${socketType} ${socket.id}`
    );
  }
  return [socket[socketType], disconnect];
};

export default useSocket;
