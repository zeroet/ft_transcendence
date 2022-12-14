import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import EachHistory from "./EachHistory";

const MyHistory = ({ id }: { id: number }) => {
  const { data: historyData, error: historyError } = useSWR(
    `/api/users/match/${id}`
  );
  const { data: userData } = useSWR(`/api/users/${id}`);

  useEffect(() => {
    mutate(`/api/users/match/${id}`);
  }, [userData]);

  if (!historyData || !userData) return <Loading />;
  return (
    <div>
      <div className="dummy box"></div>
      <div className="history box">
        <h1>LAST 5 MATCHES HISTORY</h1>
        {historyData &&
          userData &&
          historyData.map((eachHistory: any) => {
            return (
              <div key={eachHistory.id} className="history-div">
                <EachHistory
                  winer={eachHistory.winner.username}
                  loser={eachHistory.loser.username}
                  winnerScore={
                    eachHistory.score[0] > eachHistory.score[1]
                      ? eachHistory.score[0]
                      : eachHistory.score[1]
                  }
                  loserSocre={
                    eachHistory.score[0] < eachHistory.score[1]
                      ? eachHistory.score[0]
                      : eachHistory.score[1]
                  }
                  username={userData.username}
                />
              </div>
            );
          })}
      </div>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 2fr 4fr;
        }

        h1 {
          font-family: "Fragment Mono", monospace;
          font-weight: bold;
          background-color: black;
          margin: 0;
          padding: 30px;
          color: white;
        }

        .titleOfHistory {
          // border-top: 3px ridge brown;
        }

        hr {
          border-top: 1px solid;
          width: 90%;
          margin: auto;
          margin-top: 0px;
          margin-bottom: 20px;
        }

        .history {
          display: flex;
          flex-direction: column;
          text-align: center;
          width: 95%;
          height: 95%;
          background: #ffffff;
          border: 1px solid #000000;
          border-radius: 10%;
        }

        .history-div {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MyHistory;
