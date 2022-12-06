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
        margin: 10px;
        height: 60px;
        display: inline-block;
        background: #A8DADD;
      }

      .other-content-box {
        margin: 10px;
        height: 60px;
        display: inline-block;
        background: #f9d4d4;
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
        margin-top 
        font-family: "Doppio One";
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        /* identical to box height, or 118% */
        
        text-transform: uppercase;
          
        color: #000000;
      }
      .content {
        font-family: "Doppio One";
        font-style: normal;
        font-weight: 400;
        font-size: 21px;
        line-height: 20px;
        /* identical to box height, or 95% */
        margin-left: 11px;
        text-transform: uppercase;
        
        color: #000000;
      }
        `}</style>
    </div>
  );
};

export default ChatList;
