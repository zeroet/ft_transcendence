import useSWR from "swr";
import Loading from "../../../errorAndLoading/Loading";
import { UserInfo } from "../../../../interfaceType";
import axios from "axios";

const TextProfil = ({ id }: { id: string }) => {
  const { data: user, error } = useSWR<UserInfo>(
    id === "-1" ? "/api/users" : `/api/users/${id}`
  );
  const userNameFontSize = { size: 50 };
  /*
   1. useSWR with new API for loss, victory, winRate
  */

  if (user && user.username.length >= 20) {
    userNameFontSize.size = 25;
  }

  const loss = 1432;
  const victory = 44432;
  const winRate = Math.round((victory / (loss + victory)) * 100);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!user) return <Loading />;
  return (
    <div>
      <div className="name">
        <h1 className="userName">{user.username}</h1>
      </div>
      <div className="info">
        <h3 className="victory">ViCTORY: {victory}</h3>
        <h3 className="loss">LOSS: {loss}</h3>
        <h3>WINRATE: {winRate}%</h3>
      </div>
      <style jsx>{`
        div {
          display: grid;
          margin-left: 5px;
        }
        .userName {
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: bold;
          font-size: ${userNameFontSize.size}px;
          line-height: 20px;
          /* or 40% */
          text-transform: uppercase;
          color: #000000;
        }
        h3 {
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 30px;
          /* or 150% */
          text-transform: uppercase;
          margin: 0px;
        }
        .victory {
          color: green;
        }
        .loss {
          color: red;
        }
        .name {
          margin-top: 48px;
          overflow: hidden;
        }
        .info {
          margin-bottom: 30px;
          // background-color: yellow;
        }
      `}</style>
    </div>
  );
};

export default TextProfil;
