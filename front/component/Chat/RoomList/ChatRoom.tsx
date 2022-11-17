import { useState } from "react";
import CreateChat from "./CreateChat";

export default function ChatRoom() {
  const [showCreateChatModal, setShowCreateChatModal] =
    useState<boolean>(false);

  const addChat = () => {
    setShowCreateChatModal(true);
  };

  const onClose = () => {
    setShowCreateChatModal(false);
  };

  return (
    <div className="ChatRoom">
      {showCreateChatModal && <CreateChat onClose={onClose} />}
      <div className="chat-div">
        <h1>CHAT ROOM</h1>
        <button onClick={addChat} className="button" type="button">
          +
        </button>
      </div>
      <hr />
      {/* 여기도 map? */}
      <ul>
        <li>chat room 1</li>
        <li>chat room 2</li>
        <li>chat room 3</li>
      </ul>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
        button {
          background-color: white;
          border-style: none;
          cursor: pointer;
        }

        .ChatRoom {
          height: 50%;
        }

        .chat-div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .button {
          margin: 10px;
        }
      `}</style>
    </div>
  );
}
