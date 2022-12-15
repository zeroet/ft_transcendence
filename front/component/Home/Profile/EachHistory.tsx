import { useEffect, useState } from "react";
import { infoOfHistory } from "../../../interfaceType";

const EachHistory = ({
  winer,
  loser,
  winnerScore,
  loserSocre,
  username,
}: infoOfHistory) => {
  const [winOrLoss, setWinOrLose] = useState<string>("");
  useEffect(() => {
    if (username === winer) {
      setWinOrLose("win");
    } else {
      setWinOrLose("lose");
    }
  }, [username]);

  return (
    <div>
      <div className={winOrLoss}>{winOrLoss}</div>
      <div className="result">
        <div className="winner">{`${winer}`}</div>
        <div className="score">{`${winnerScore} : ${loserSocre}`}</div>
        <div className="loser">{`${loser}`}</div>
      </div>
      <hr />
      <style jsx>{`
        .win {
          font-size: 17px;
          font-weight: bold;
          color: green;
          margin-bottom: 10px;
          margin-top: 10px;
        }

        .lose {
          font-size: 17px;
          font-weight: bold;
          color: red;
          margin-bottom: 10px;
          margin-top: 10px;
        }

        hr {
          border-top: 0.5px;
          width: 90%;
          margin: auto;
          margin-top: 0px;
          margin-bottom: 5px;
        }

        div {
          overflow: hidden;
        }
        .result {
          display: flex;
          justify-content: center;
        }
        .winner {
          font-size: 14px;
          width: 250px;
          text-align: left;
          margin-left: 100px;
          //   font-weight: bold;
        }
        .loser {
          font-size: 14px;
          width: 250px;
          text-align: right;
          //   font-weight: bold;
          margin-right: 100px;
        }
        .score {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default EachHistory;
