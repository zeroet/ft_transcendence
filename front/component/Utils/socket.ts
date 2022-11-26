import { useCallback } from "react";
import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";

const socket: { [key: string]: Socket } = {};

const useSocket = (
  accessToken: string,
  socketType: string
): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket[socketType]) {
      console.log(
        socket[socketType].id,
        "===================disconnet socket=============="
      );
      socket[socketType].disconnect();
      delete socket[socketType];
    }
  }, [socketType]);

  if (!socket[socketType]) {
    socket[socketType] = socketIOClient("http://localhost:8080", {
      extraHeaders: {
        accessToken,
      },
    });
    console.log("=================create new socket==========================");
  } else {
    // console.log("use socket in socket.ts");
  }

  return [socket[socketType], disconnect];
};

export default useSocket;
