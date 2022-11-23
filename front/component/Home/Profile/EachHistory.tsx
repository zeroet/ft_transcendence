import { infoOfHistory } from "../../../interfaceType";

const EachHistory = ({
  winOrLoss,
  firstPlayer,
  secondPlayer,
  point,
}: infoOfHistory) => {
  return (
    <div>
      <p className={winOrLoss}>{winOrLoss}</p>
      <p>{`${firstPlayer}    ${point}    ${secondPlayer}`}</p>
      <hr />
      <style jsx>{`
        p {
          margin: 8px;
        }
        .win {
          color: green;
        }

        .loss {
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
