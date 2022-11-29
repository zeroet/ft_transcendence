import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import EachRoom from "./EachRoom";

export default function ChatRoom() {
  const { data, error } = useSWR(`/api/chatroom`, fetcher);

  if (data) {
    console.log(data);
  }
  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <div>
      <div className="list">
        <ul>{}</ul>
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
