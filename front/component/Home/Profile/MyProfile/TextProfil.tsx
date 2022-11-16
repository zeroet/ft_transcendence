import useSWR from "swr";
import fetcher from "../../../Utils/fetcher";

const TextProfil = () => {
  const { data: user, error, mutate} = useSWR("/api/users", fetcher);
  
  /*
   1. useSWR with new API for loss, victory, winRate
  */


  const loss = 1;
  const victory = 4;
  const winRate = "80";

  if (error) return <div>failed to load</div>;
  if (!user) return <div>loading...</div>;
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
          font-family: "Doppio One";
          font-style: normal;
          font-weight: 400;
          font-size: 50px;
          line-height: 20px;
          /* or 40% */

          text-transform: uppercase;

          color: #000000;
        }
        h3 {
          font-family: "Doppio One";
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
        }
      `}</style>
    </div>
  );
};

export default TextProfil;
