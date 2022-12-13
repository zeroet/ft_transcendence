import styles from "../../styles/LayoutBox.module.css";
import useSWR, { mutate } from "swr";
import fetcher from "../Utils/fetcher";
import Loading from "../errorAndLoading/Loading";
import { TypeChatId, IChatMember } from "../../interfaceType";
import axios from "axios";
import EachParticipant from "./Participant/EachParticipant";
import useSocket from "../Utils/socket";
import { useEffect } from "react";

/**
 *
 * id로 들어온값은 id / link가 있다.
 * id는 dm / chat의  id
 * link는  dm / chat을 구분하는 구분자
 *
 * api요청시에, link에 따라 다르게 요청을 보내야하기때문
 * useSWR을 따로만들어서 커스터마이징하도... 될듯
 *
 */
export default function Participant({
  id,
  ownerId,
  accessToken,
}: {
  id: TypeChatId;
  ownerId: number | null;
  accessToken: string;
}) {
  // console.log("type chat id == ", id);
  const isId = Object.keys(id).length !== 0;
  const [socket] = useSocket(accessToken, "chat");
  // link가 chat일때! 나머지는 뒤에 null빼고 dm넣으면됨
  const { data: roomMembersData, error: roomMembersError } = useSWR<
    IChatMember[]
  >(isId ? `/api/${id.link}/${id.id}/members` : null, isId ? fetcher : null);
  const { data: myData, error: myError } = useSWR("/api/users");
  const { data: roomParticipantData } = useSWR<IChatMember[]>(
    isId ? `/api/${id.link}/${id.id}/participants` : null,
    isId ? fetcher : null
  );

  useEffect(() => {
    socket?.on("newParticipantList", () => {
      console.log("new participant");
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
          roomParticipantData?.map((member: IChatMember) => {
            const color = { color: "red" };
            roomMembersData?.map((loginMember: IChatMember) => {
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
                  />
                  {ownerId === member.userId && (
                    <img
                      src="/images/crown.png"
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
