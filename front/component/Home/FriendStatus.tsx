import useSWR from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";

export default function FriendStatus({ id }: { id: string }) {
  const { data: friendListData, error: friendListError } = useSWR(
    `/api/users/friend/list`
  );

  console.log(friendListData);
  if (!friendListData) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Friend Status</h1>
      <hr />
      <ul>
        {friendListData &&
          friendListData.map((eachFriend: any) => {
            console.log(eachFriend);
            return <li key={eachFriend.id}>{eachFriend.username}</li>;
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
