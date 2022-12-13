import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";
import EachHistory from "./EachHistory";

const MyHistory = ({ id }: { id: number }) => {
  const [socketGame] = useSocket(null, "game");
  const { data: historyData, error: historyError } = useSWR(
    `/api/users/match/${id}`
  );
  const { data: rankData, error: rankError } = useSWR(`/api/users/rank/${id}`);
  console.log(socketGame);

  // useEffect(() => {
  //   socketGame?.on("match", () => {
  //     mutate(`/api/users/match/${id}`);
  //     return () => {
  //       socketGame?.off("match");
  //     };
  //   });
  // }, [socketGame?.id, historyData, rankData]);

  console.log(historyData);
  console.log(rankData);
  if (!historyData) return <Loading />;
  return (
    <div>
      <div className="dummy"></div>
      <div className="history">
        <h1>LAST 5 MATCHES HISTORY</h1>
        {/* <hr className="titleOfHistory" /> */}
        {
          <EachHistory
            winOrLoss={"win"}
            firstPlayer={`hyungyoo`}
            secondPlayer={"cjung-mo"}
            point={"5:4"}
          />
        }
        {
          <EachHistory
            winOrLoss={"loss"}
            firstPlayer={`cjung-mo`}
            secondPlayer={"hyungyoo"}
            point={"4:1"}
          />
        }
        {
          <EachHistory
            winOrLoss={"win"}
            firstPlayer={`hyungyoo`}
            secondPlayer={"cjung-mo"}
            point={"5:4"}
          />
        }
        {
          <EachHistory
            winOrLoss={"loss"}
            firstPlayer={`cjung-mo`}
            secondPlayer={"hyungyoo"}
            point={"4:1"}
          />
        }
        {
          <EachHistory
            winOrLoss={"win"}
            firstPlayer={`hyungyoo`}
            secondPlayer={"cjung-mo"}
            point={"5:4"}
          />
        }
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
          //   box-sizing: border-box;
          width: 95%;
          height: 95%;
          background: #ffffff;
          border: 1px solid #000000;
          border-radius: 10%;
        }
      `}</style>
    </div>
  );
};

export default MyHistory;
