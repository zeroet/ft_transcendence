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
      // console.log(
      //   socket[socketType].id,
      //   socketType,
      //   "===================disconnet socket=============="
      // );
      socket[socketType].disconnect();
      delete socket[socketType];
    }
  }, [socketType]);

  if (!socket[socketType]) {
    const path = socketType === "chat" ? "/chat" : "/game";
    // if (socketType === "game") {
    //   socket[socketType] = socketIOClient("http://localhost:8080", {
    //     extraHeaders: {
    //       accessToken,
    //     },
    //   });
    // } else if (socketType === "chat") {
    socket[socketType] = socketIOClient("http://localhost:8080", {
      extraHeaders: {
        accessToken,
      },
      path,
    });
  }
  // console.log(`backURL for ${socketType}`);
  // console.log(
  //   `=================create new socket========================== ${socketType}`
  // );
  // } else {
  // console.log("use socket in socket.ts");
  // }
  // console.log(socket);

  return [socket[socketType], disconnect];
};

export default useSocket;
