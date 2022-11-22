import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import CreateChat from "./CreateChat";
import EachRoom from "./EachRoom";

export default function ChatRoom() {
  const [showCreateChatModal, setShowCreateChatModal] =
    useState<boolean>(false);

  const addChat = () => {
    setShowCreateChatModal(true);
  };

  const onClose = () => {
    setShowCreateChatModal(false);
  };

  const { data, error } = useSWR(`https://dummyjson.com/posts/`, fetcher);

  if (data) {
    console.log(data);
  }
  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <div className="ChatRoom">
      {showCreateChatModal && (
        <div className="modal-background">
          <CreateChat onClose={onClose} />
        </div>
      )}
      <div className="chat-div">
        <h1>CHAT ROOM</h1>
        <button onClick={addChat} className="button" type="button">
          +
        </button>
      </div>
      <hr />
      {
        <ul key={data.posts.id}>
          {data.posts &&
            data.posts.map((post: any) => (
              <li>
                <EachRoom title={post.title} id={post.id} />
              </li>
            ))}
        </ul>
      }
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
