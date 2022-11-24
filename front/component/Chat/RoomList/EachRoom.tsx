import Link from "next/link";
import React from "react";


interface EachRoomTye {
  title: string;
  id: string;
}

const EachRoom = ({ title, id }: EachRoomTye) => {
  return (
    <div>
      <Link href={`/ChatRoom/${id}`} legacyBehavior>
        <a>
          Room ${id}: ${title}
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
