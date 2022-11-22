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
      socket[socketType].disconnect();
      delete socket[socketType];
    }
    console.log("===================disconnet socket==============");
  }, [socketType]);

  if (!socket[socketType]) {
    socket[socketType] = socketIOClient("http://localhost:8080", {
      extraHeaders: {
        accessToken,
      },
    });
    console.log("=================create new socket==========================");
  } else {
    console.log("======================use socket=====================");
  }

  return [socket[socketType], disconnect];
};

export default useSocket;
