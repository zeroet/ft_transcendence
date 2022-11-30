import Link from "next/link";

interface EachDmRoomType {
  title: string;
  id: string;
}

const EachDmRoom = ({ title, id }: EachDmRoomType) => {
  return (
    <div>
      <Link href={`/EachDmRoom/${id}`} legacyBehavior>
        <a>
          DM ${id} : ${title}
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

export default EachDmRoom;
