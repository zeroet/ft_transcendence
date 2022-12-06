import axios from "axios";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import { IDm } from "../../../interfaceType";
import { useEffect } from "react";
import useSocket from "../../Utils/socket";

export default function DM() {
  const { data: DMData, error: DMError } = useSWR(`/api/dm`);
  const [socket] = useSocket(null, "chat");

  useEffect(() => {
    socket?.on("newDmList", (data: string) => {
      console.log(data, " for new DM list in ChatRoom socket!");
      mutate("/api/dm");
    });
    return () => {
      socket?.off("newDmList");
    };
  }, [DMData]);

  console.log(DMData);
  if (DMError) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!DMData) return <Loading />;
  return (
    <div className="DM">
      <ul>
        {DMData &&
          DMData.map((eachDM: IDm) => {
            <li>
              eachDM senderId: ${eachDM.senderId} and receiverId: $
              {eachDM.receiverId}
            </li>;
          })}
      </ul>
      <style jsx>
        {`
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
