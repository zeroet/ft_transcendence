import axios from "axios";
import React from "react";
import useSWR from "swr";
import Loading from "../../errorAndLoading/Loading";

/**
 * chat css 확인용
 */

const dummyChatting = [
  {
    id: 1,
    username: "cjung-mo",
    content: "hello!!!!!!!!!",
  },
  {
    id: 2,
    username: "hyung jun yoo",
    content: "what?",
  },
  {
    id: 3,
    username: "keulee",
    content: "what??",
  },
  {
    id: 4,
    username: "seyun",
    content: "what!!!!!!!!!!?",
  },
  {
    id: 5,
    username: "hyung jun yoo",
    content: "what?????????????????????????",
  },
  {
    id: 6,
    username: "eyoo",
    content: "what??",
  },
  {
    id: 7,
    username: "eyoo",
    content: "what??",
  },
  {
    id: 8,
    username: "eyoo",
    content: "what??",
  },
  {
    id: 9,
    username: "eyoo",
    content: "what??",
  },
  {
    id: 10,
    username: "eyoo",
    content: "what??",
  },
];

const ChatList = () => {
  const { data: userData, error: userError } = useSWR("/api/users");
  /**
   * chat room에 있는 대화내용들은 props로 chatRoomBody로 부터 받아와야한다.
   * 그렇지않으면 optimistic ui를 구현하기어려움.
   * mutate는 쳇박스에,
   * data는 chatList에 전달한다.
   */
  console.log(userData);
  if (userError) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!userData) return <Loading />;
  return (
    <div className="c-body">
      <ul>
        {dummyChatting &&
          dummyChatting.map((chat: any, id) => {
            return (
              <div key={chat.id} className={`div-box`}>
                <div className="content-box">
                  <p className="username">{chat.username}</p>
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
      .div-box {
        margin: 0px;
        display: flex;
        justify-content: flex-end;
      }     
      .content-box {
        margin: 10px;
        height: 60px;
        display: inline-block;
        // background: #f9d4d4;
        background: #A8DADD;
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
