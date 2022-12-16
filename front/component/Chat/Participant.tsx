import styles from "../../styles/LayoutBox.module.css";
import useSWR, { mutate } from "swr";
import fetcher from "../Utils/fetcher";
import Loading from "../errorAndLoading/Loading";
import { TypeChatId, IChatParticipant } from "../../interfaceType";
import axios from "axios";
import EachParticipant from "./Participant/EachParticipant";
import useSocket from "../Utils/socket";
import { useEffect } from "react";

export default function Participant({
  id,
  ownerId,
  accessToken,
}: {
  id: TypeChatId;
  ownerId: number | null;
  accessToken: string;
}) {
  const isId = Object.keys(id).length !== 0;
  const [socket] = useSocket(accessToken, "chat");
  const { data: roomMembersData, error: roomMembersError } = useSWR<
    IChatParticipant[]
  >(isId ? `/api/${id.link}/${id.id}/members` : null, isId ? fetcher : null);
  const { data: myData, error: myError } = useSWR("/api/users");
  const { data: roomParticipantData } = useSWR<IChatParticipant[]>(
    isId ? `/api/${id.link}/${id.id}/participants` : null,
    isId ? fetcher : null
  );

  useEffect(() => {
    socket?.on("newParticipantList", () => {
      mutate(`/api/${id.link}/${id.id}/participants`);
      mutate(`/api/${id.link}/${id.id}`);
    });
    socket?.on("newMemberList", () => {
      mutate(`/api/${id.link}/${id.id}/members`);
      mutate(`/api/${id.link}/${id.id}`);
    });
    return () => {
      socket?.off("newMemberList");
      socket?.off("newParticipantList");
    };
  }, [socket?.id, roomMembersData, id.id, myData, roomParticipantData]);

  if (roomMembersError || myError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (
    (isId && !roomMembersData) ||
    !socket ||
    (isId && !myData) ||
    (isId && !roomParticipantData)
  )
    return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      <ul>
        {isId &&
          roomParticipantData?.map((member: IChatParticipant) => {
            const color = { color: "red" };
            roomMembersData?.map((loginMember: IChatParticipant) => {
              if (loginMember.userId === member.userId) {
                color.color = "green";
              }
            });
            return (
              <li key={member.userId}>
                <div className="participant">
                  <EachParticipant
                    username={member.User.username}
                    userId={member.userId}
                    isOwner={ownerId === myData.id}
                    chatId={id.id}
                    color={color.color}
                    isAdmin={member.isAdmin}
                  />
                  {ownerId === member.userId && (
                    <img
                      src="/images/crown.png"
                      width={"20px"}
                      height={"20px"}
                    />
                  )}
                  {ownerId !== member.userId && member.isAdmin && (
                    <img
                      src="/images/crown_bw.png"
                      width={"20px"}
                      height={"20px"}
                    />
                  )}
                </div>
              </li>
            );
          })}
      </ul>
      <style jsx>{`
        .participant {
          display: flex;
          margin-left: -25px;
          margin-bottom: 7px;
          font-size: 17px;
        }
        img {
          margin-left: 10px;
          margin-top: -2px;
        }
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
        li {
          list-style: none;
        }
      `}</style>
    </div>
  );
}
