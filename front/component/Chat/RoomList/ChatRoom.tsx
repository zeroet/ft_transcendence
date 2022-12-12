import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import useSocket from "../../Utils/socket";
import { IChatroom } from "../../../interfaceType";

export default function ChatRoom() {
  const { data, error } = useSWR(`/api/chatroom`, fetcher);
  const [socket] = useSocket(null, "chat");

  useEffect(() => {
    socket?.on("newRoomList", () => {
      mutate("/api/chatroom");
    });
    return () => {
      socket?.off("newRoomList");
    };
  }, [data, socket?.id]);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div>
      <div className="list">
        <hr />
        <ul>
          {data.map((room: IChatroom) => {
            return (
              <Link
                href={{
                  pathname: `/Chat`,
                  query: { id: room.id, link: "chatroom" },
                }}
                key={room.id}
                legacyBehavior
              >
                <a>
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
                </a>
              </Link>
            );
          })}
        </ul>
      </div>
      <style jsx>{`
        a {
          text-decoration: none;
          color: black;
        }
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
