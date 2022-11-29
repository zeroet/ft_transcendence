import Link from "next/link";
import React from "react";

interface EachRoomTye {
  title: string;
  chatroomId: string;
}

const EachRoom = ({ title, chatroomId }: EachRoomTye) => {
  return (
    <div>
      <Link href={`/ChatRoom/${chatroomId}`} legacyBehavior>
        <a>
          Room ${chatroomId}: ${title}
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
