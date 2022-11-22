import Link from "next/link";

interface DmRoomTyp {
    title: string;
    id: string;
}



const DmRoom = ({title, id}: DmRoomTyp) => {
    return (
        <div >
          <Link href={`/DmRoom/${id}`} legacyBehavior>
            <a >
                DM ${id} : ${title}
            </a>
         </Link>

            <style jsx>{`
                a{
                    text-decoration: none;
                 //color: black;
                }
            `}</style>
        </div>
    );
};

export default DmRoom;