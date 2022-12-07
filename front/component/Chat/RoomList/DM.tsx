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
      if (myData.id === data.User2.id) {
        alert(`you have DM message from ${data.User1.username}`);
      }
      mutate("/api/dm");
    });
    return () => {
      socket?.off("newDmList");
    };
  }, [DMData, myData]);

  // console.log(DMData);
  if (DMError || myError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!DMData || !myData) return <Loading />;
  return (
    <div className="DM">
      <ul>
        {DMData &&
          DMData.map((eachDM: any) => {
            // console.log(eachDM, "is eachDM from DM.tsx");
            const DM = { username: "", image_url: "" };
            // console.log(eachDM.User1.id, eachDM.User2.id);
            if (eachDM.User1.id === myData.id) {
              DM.username = eachDM.User2.username;
              DM.image_url = eachDM.User2.image_url;
            } else if (eachDM.User2.id === myData.id) {
              DM.username = eachDM.User1.username;
              DM.image_url = eachDM.User1.image_url;
            } else {
              return;
            }
            return (
              <li key={eachDM.id}>
                <Link
                  href={{
                    pathname: "/Chat",
                    query: {
                      id: eachDM.id,
                      link: "dm",
                    },
                  }}
                >
                  <div className="DM-list">
                    <img src={DM.image_url} width={"25px"} height={"25px"} />
                    <div>{DM.username}</div>
                  </div>
                </Link>
              </li>
            );
          })}
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
