import axios from "axios";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import { useEffect } from "react";
import useSocket from "../../Utils/socket";
import Link from "next/link";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function DM() {
  const { data: DMData, error: DMError } = useSWR(`/api/dm`);
  const [socket] = useSocket(null, "chat");
  const { data: myData, error: myError } = useSWR("/api/users");

  useEffect(() => {
    socket?.on("newDmList", (data) => {
      if (myData.id === data.User2.id) {
        toast.info(`you have DM message from ${data.User1.username}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: true,
        });
      }
      mutate("/api/dm");
    });
    return () => {
      socket?.off("newDmList");
    };
  }, [DMData, myData]);

  if (DMError || myError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!DMData || !myData) return <Loading />;
  return (
    <div className="DM">
      <ul>
        {DMData &&
          DMData.map((eachDM: any) => {
            const DM = { username: "", image_url: "" };
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
                  legacyBehavior
                >
                  <a>
                    <div className="DM-list">
                      <img src={DM.image_url} width={"25px"} height={"25px"} />
                      <div className="username">{DM.username}</div>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
      </ul>
      <style jsx>
        {`
          li {
            list-style: none;
            margin-left: -30px;
            margin-bottom: 7px;
          }
          a {
            text-decoration: none;
            color: black;
          }
          .DM-list {
            display: flex;
          }
          img {
            margin-right: 20px;
            border-radius: 50%;
          }
          .username {
            margin-top: 2px;
            margin-left: -10px;
          }
        `}
      </style>
    </div>
  );
}
