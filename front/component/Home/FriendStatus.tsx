import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";

export default function FriendStatus({ id }: { id: string }) {
  const [chatSocket] = useSocket(null, "chat");
  const { data: friendListData, error: friendListError } = useSWR(
    `/api/users/friend/list`
  );

  useEffect(() => {
    chatSocket?.on("status", () => {
      mutate(`/api/users/friend/list`);
    });
    return () => {
      chatSocket?.off("status");
    };
  }, [friendListData, chatSocket?.id]);

  if (!friendListData || !chatSocket) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Friend Status</h1>
      <hr />
      <ul>
        {friendListData &&
          friendListData.map((eachFriend: any) => {
            console.log(eachFriend);
            return (
              <div key={eachFriend.id} className="friend">
                <div className="status"></div>
                <div>{eachFriend.friendUsername}</div>
              </div>
            );
          })}
      </ul>
      <style jsx>{`
        .friend {
          display: flex;
          align-items: center;
        }
        .status {
          background-color: ${friendListData.status === "Login" && "green"};
          background-color: ${friendListData.status === "Game" && "yellow"};
          background-color: ${friendListData.status === "Logout" && "red"};
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
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
