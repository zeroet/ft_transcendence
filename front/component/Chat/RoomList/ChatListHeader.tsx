import { useState } from "react";
import CreateChat from "./CreateChat";

export default function ChatListHeader() {
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
      {showCreateChatModal && (
        <div className="modal-background">
          <CreateChat onClose={onClose} />
        </div>
      )}
      <div className="chat-div">
        <div className="chatroom-header">
          <h1>CHAT ROOM</h1>
          <button onClick={addChat} className="button" type="button">
            +
          </button>
        </div>
        <hr />
      </div>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
        .ChatRoom {
          // background-color: red;
          position: absolute;
          width: 22.2%;
        }
        button {
          background-color: white;
          border-style: none;
          cursor: pointer;
        }

        .chatroom-header {
          background-color: white;
          display: flex;
          width: 100%;
          justify-content: space-between;
          overflow: auto;
        }
        .button {
          margin: 10px;
        }
        .modal-background {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}
