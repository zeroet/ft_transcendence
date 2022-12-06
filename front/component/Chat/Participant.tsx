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

  useEffect(() => {
    socket?.on("newMemberList", (res: String) => {
      // console.log(res, "is res from newMemberList socket in participant");
      if (isId && id.link === "chatroom") {
        mutate(`/api/${id.link}/${id.id}/members`);
      }
    });
    return () => {
      socket?.off("newMemberList");
    };
  }, [socket, roomMembersData, id.id, myData]);

  // if (isId && roomMembersData) {
  //   console.log(roomMembersData);
  // }
  if (roomMembersError || myError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if ((isId && !roomMembersData) || !socket || !myData) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      <ul>
        {isId &&
          roomMembersData?.map((member: IChatMember) => {
            return (
              <li key={member.userId}>
                <div className="participant">
                  <EachParticipant
                    username={member.User.username}
                    userId={member.userId}
                    isOwner={ownerId === myData.id}
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
      {/* <ul>
        {isId &&
          id.chatroom === "dm" &&
          /.../
        }
      </ul> */}
      <style jsx>{`
        .participant {
          display: flex;
          margin-left: -25px;
        }
        img {
          margin-left: 10px;
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
