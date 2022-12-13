import styles from "../../styles/LayoutBox.module.css";
import useSWR from "swr";
import Loading from "../errorAndLoading/Loading";
import { TypeChatId } from "../../interfaceType";

export default function ParticipantDm({ id }: { id: TypeChatId }) {
  const { data: dmRoomParticipantData } = useSWR(`/api/${id.link}/${id.id}`);
  const { data: myData } = useSWR("/api/users");

  if (!dmRoomParticipantData || !myData) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      <ul>
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
