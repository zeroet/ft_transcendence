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
      <h3 className={winOrLoss}>{winOrLoss}</h3>
      <p>{`${winer}    ${winnerScore} : ${loserSocre}    ${loser}`}</p>
      <hr />
      <style jsx>{`
        p {
          margin: 8px;
        }
        .win {
          color: green;
        }

        .lose {
          color: red;
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
      `}</style>
    </div>
  );
};

export default EachHistory;
