import axios from "axios";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import { useEffect } from "react";
import useSocket from "../../Utils/socket";
import Link from "next/link";

export default function DM() {
  const { data: DMData, error: DMError } = useSWR(`/api/dm`);
  const [socket] = useSocket(null, "chat");
  const { data: myData, error: myError } = useSWR("/api/users");

  useEffect(() => {
    socket?.on("newDmList", (data) => {
      console.log(data, " for new DM list in ChatRoom socket!");
      // if (myData.id === data.receiverId) {
      //   alert(`you have DM message from ${data.Sender.username}`);
      // }
      // mutate("/api/dm");
    });
    return () => {
      socket?.off("newDmList");
    };
  }, [DMData]);

  if (DMError || myError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!DMData || !myData) return <Loading />;
  return (
    <div className="DM">
      <ul>
        {/* {DMData &&
          DMData.map((eachDM: any) => {
            const DM = { username: "", image_url: "" };
            if (eachDM.senderId === myData.id) {
              DM.username = eachDM.Receiver.username;
              DM.image_url = eachDM.Receiver.image_url;
            } else {
              DM.username = eachDM.Sender.username;
              DM.image_url = eachDM.Sender.image_url;
            }
            return (
              <li>
                <Link
                  href={{
                    pathname: "/Chat",
                    query: {
                      receiverId: eachDM.Receiver.id,
                      senderId: eachDM.Sender.id,
                      link: "dm",
                    },
                  }}
                  key={eachDM.id}
                >
                  <div className="DM-list">
                    <img src={DM.image_url} width={"25px"} height={"25px"} />
                    <div>{DM.username}</div>
                  </div>
                </Link>
              </li>
            );
          })} */}
      </ul>
      <style jsx>
        {`
          .DM-list {
            display: flex;
          }
          img {
            margin-right: 20px;
            border-radius: 50%;
          }
          h1 {
            font-family: "Fragment Mono", monospace;
            font-weight: bold;
            font-size: 25px;
            line-height: 20px;
            margin-left: 10px;
            /* identical to box height, or 67% */
            text-transform: uppercase;
          }
          .DM {
            height: 300px;
          }
        `}
      </style>
    </div>
  );
}
