import Link from "next/link";
import React from "react";


interface EachRoomTye {
  title: string;
  chatroom_id: string;
}

const EachRoom = ({ title, chatroom_id }: EachRoomTye) => {
  return (
    <div>
      <Link href={`/ChatRoom/${chatroom_id}`} legacyBehavior>
        <a>
          Room ${chatroom_id}: ${title}
        </a>
      </Link>
      <style jsx>{`
        a {
          text-decoration: none;
          //color: black;
        }
      `}</style>
    </div>
  );
};

export default EachRoom;
