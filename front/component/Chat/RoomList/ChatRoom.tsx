import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import useSocket from "../../Utils/socket";
import { IChatroom } from "../../../interfaceType";
// import EachRoom from "./delete apres";

export default function ChatRoom({ accessToken }: { accessToken: string }) {
  const { data, error } = useSWR(`/api/chatroom`, fetcher);
  const [socket] = useSocket(accessToken, "chat");
  // if (data) {
  //   console.log(data);
  // }

  useEffect(() => {
    socket?.on("newRoomList", (data: string) => {
      console.log(data);
      mutate("/api/chatroom");
    });
    return () => {
      socket?.off("newRoomList");
    };
  }, []);
  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div>
      <div className="list">
        <ul>
          {data.map((room: IChatroom) => {
            return (
              <Link
                href={{
                  pathname: `/Chat`,
                  query: { id: room.chatroomId, link: "chat" },
                }}
                key={room.chatroomId}
              >
                <div className="room-li">
                  <img
                    src={
                      room.isPrivate
                        ? "/images/private.png"
                        : "/images/public.png"
                    }
                    width="20px"
                  />
                  <li className="roomname">{room.chatroomName}</li>
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
      <style jsx>{`
        .list {
          height: 300px;
          margin-top: 55px;
          margin-left: -30px;
        }
        .room-li {
          list-style: none;
          display: flex;
          margin-bottom: 7px;
        }
        .roomname {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
