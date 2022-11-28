import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import EachRoom from "./EachRoom";

export default function ChatRoom() {
  // const { data, error } = useSWR(`https://dummyjson.com/posts/`, fetcher);
  // const { data, error } = useSWR(`/api/chatroom`, fetcher);

  // if (data) {
  //   console.log(data);
  // }
  // if (error) return <Error />;
  // if (!data) return <Loading />;

  return (
    <div>
      <div className="list">
        {/* <ul>
          {data &&
            data.map((post: any) => {
              return (
                <li key={post.chatroomId}>
                  <EachRoom
                    title={post.chatroomName}
                    chatroomId={post.chatroomId}
                  />
                </li>
              );
            })}
        </ul> */}
      </div>
      <style jsx>{`
        .list {
          height: 300px;
          margin-top: 55px;
        }
      `}</style>
    </div>
  );
}
