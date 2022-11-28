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
        socketType,
        "===================disconnet socket=============="
      );
      socket[socketType].disconnect();
      delete socket[socketType];
    }
  }, [socketType]);

  if (!socket[socketType]) {
    let backURL;
    if (socketType === "game") {
      backURL = "http://localhost:8080";
      console.log(`backURL for ${socketType}`);
    } else if (socketType === "chat") {
      backURL = "http://localhost:8080/chat";
    }
    if (backURL) {
      socket[socketType] = socketIOClient(backURL, {
        extraHeaders: {
          accessToken,
        },
      });
      console.log(
        `=================create new socket========================== ${socketType}`
      );
    } else {
      console.log("소켓 못만듬! url이 정의되지않음");
    }
  } else {
    // console.log("use socket in socket.ts");
  }

  return [socket[socketType], disconnect];
};

export default useSocket;
