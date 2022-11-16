import { useState } from "react";
import CreatChat from "./CreateChat";

export default function ChatRoom() {
  const [creatChatModal, setCreateChatModal] = useState<boolean>(false);

  const addChat = () => {
    setCreateChatModal((curr) => !curr);
  };
  return (
    <div className="ChatRoom">
      {creatChatModal && <CreatChat />}
      <div className="chat-div">
        <h1>CHAT ROOM</h1>
        <button onClick={addChat}>+</button>
      </div>
      <hr />
      <ul>
        <li>chat room 1</li>
        <li>chat room 2</li>
        <li>chat room 3</li>
      </ul>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
        }
        button {
          background-color: white;
          border-style: none;
          cursor: pointer;
        }

        .ChatRoom {
          height: 410px;
        }

        .chat-div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 5px;
        }
      `}</style>
    </div>
  );
}
