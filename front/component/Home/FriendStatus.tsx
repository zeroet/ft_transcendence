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
            const color = { color: "" };
            if (eachFriend.status === "Login") {
              color.color = "green";
            } else if (eachFriend.status === "Logout") {
              color.color = "red";
            } else if (eachFriend.status === "Game") {
              color.color = "yellow";
            }
            console.log(color);
            return (
              <div key={eachFriend.id} className="friend">
                <div
                  className="status"
                  style={{ backgroundColor: color.color }}
                ></div>
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
