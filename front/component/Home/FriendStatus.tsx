import { useEffect } from "react";
import useSWR from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function FriendStatus({ id }: { id: string }) {
  const [chatSocket] = useSocket(null, "chat");

  const { data: friendListData, error: friendListError } = useSWR(
    `/api/users/friend/list`
  );

  useEffect(() => {}, [friendListData, chatSocket?.id]);
  console.log(friendListData);
  if (!friendListData || !chatSocket) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Friend Status</h1>
      <hr />
      <ul>
        {friendListData &&
          friendListData.map((eachFriend: any) => {
            console.log(eachFriend);
            return <li key={eachFriend.id}>{eachFriend.friendUsername}</li>;
          })}
      </ul>
      <style jsx>{`
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
