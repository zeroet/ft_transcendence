import axios from "axios";
import React, { useEffect, useRef } from "react";
import useSWR from "swr";
import Loading from "../../errorAndLoading/Loading";
import { IChatContent } from "../../../interfaceType";
import { TypeChatId, IDmContent } from "../../../interfaceType";

const ChatList = ({
  id,
  chatContentsData,
}: {
  id: TypeChatId;
  chatContentsData: IChatContent[] | IDmContent[];
}) => {
  const { data: userData, error: userError } = useSWR("/api/users");
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [id.id, chatContentsData]);

  if (userError) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData) return <Loading />;
  return (
    <div className="c-body" ref={scrollRef}>
      <ul>
        {chatContentsData &&
          chatContentsData.map((chat: any) => {
            const css =
              userData.username === chat.User.username ? "my" : "other";
            return (
              <div key={chat.id} className={`${css}-div-box`}>
                <div className={`${css}-content-box`}>
                  <p className="username">{chat.User.username}</p>
                  <p className="content">{chat.content}</p>
                </div>
              </div>
            );
          })}
      </ul>
      <style jsx>{`
        ul {
          padding-left: 0px;
        }
        .my-div-box {
          margin: 0px;
          display: flex;
          justify-content: flex-end;
        }
        .other-div-box {
          margin: 0px;
          display: flex;
        }
        .my-content-box {
          background: #a8dadd;
          margin: 5px;
          border-top: 10px solid transparent;
          border-right: 10px solid white;
        }
        .other-content-box {
          background: #f9d4d4;
          margin: 5px;
          border-top: 10px solid transparent;
          border-left: 15px solid white;
        }
        .c-body {
          height: 80%;
          margin-left: 10px;
          margin-right: 10px;
        }
        p {
          margin: 5px;
          pedding: 0px;
        }
        .username {
          margin-top: -3px;
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          /* identical to box height, or 118% */
          color: #000000;
        }
        .content {
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 20px;
          /* identical to box height, or 95% */
          margin-left: 11px;
          color: #000000;
        }
      `}</style>
    </div>
  );
};

export default ChatList;
