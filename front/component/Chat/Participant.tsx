import styles from "../../styles/LayoutBox.module.css";
import useSWR from "swr";
import fetcher from "../Utils/fetcher";
import Loading from "../errorAndLoading/Loading";
import { TypeChatId, IChatMember } from "../../interfaceType";
import axios from "axios";
import EachParticipant from "./Participant/EachParticipant";

// participant는 따로 모달을 만듬
// useRouter로 어디있는지에 한에서 나오는 버튼의 수를 조절함
// participant은 게임, 프로필, 채팅등에서 유저목록이 들어가는 모든곳에
// 중복으로 사용됨. 물론 중복으로 사용안해도됨

export default function Participant({
  id,
  ownerId,
}: {
  id: TypeChatId;
  ownerId: number;
}) {
  console.log("type chat id == ", id);
  const isId = Object.keys(id).length !== 0;
  // link가 chat일때!
  const { data: roomMembersData, error: roomMembersError } = useSWR(
    isId && id.link === "chat" ? `/api/chatroom/${id.id}/members` : null,
    isId && id.link === "chat" ? fetcher : null
  );

  if (isId && id.link === "chat" && roomMembersData) {
    console.log(roomMembersData);
  }
  if (roomMembersError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (isId && id.link === "chat" && !roomMembersData) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      <ul>
        {isId &&
          roomMembersData.map((member: IChatMember) => {
            return (
              <li key={member.userId}>
                <div className="participant">
                  <EachParticipant
                    username={member.User.username}
                    userId={member.userId}
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
      `}</style>
    </div>
  );
}
