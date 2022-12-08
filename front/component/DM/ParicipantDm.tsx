import styles from "../../styles/LayoutBox.module.css";
import useSWR, { mutate } from "swr";
import fetcher from "../Utils/fetcher";
import Loading from "../errorAndLoading/Loading";
import { TypeChatId, IDmContent } from "../../interfaceType";
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
export default function ParticipantDm({ id }: { id: TypeChatId }) {
  const { data: dmRoomParticipantData, error: dmRoomParticipantError } = useSWR(
    `/api/${id.link}/${id.id}`
  );
  const { data: myData, error: myError } = useSWR("/api/users");
  console.log(dmRoomParticipantData?.User1);
  console.log(dmRoomParticipantData?.User2);
  console.log(myData?.id);
  if (!dmRoomParticipantData || !myData) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      <ul>
        {/* {myData.id === dmRoomParticipantData.User1.id
            ? dmRoomParticipantData.User2.username
            : dmRoomParticipantData.User1.username} */}
        <li className="participant">
          # {dmRoomParticipantData.User1.username}
        </li>
        <li className="participant">
          # {dmRoomParticipantData.User2.username}
        </li>
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
