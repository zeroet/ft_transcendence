interface infoOfHistory {
    winOrLoss : string,
    firstPlayer : string,
    secondPlayer : string,
    point: string,
}

const EachHistory = ( { winOrLoss, firstPlayer, secondPlayer, point} : infoOfHistory ) => {
    
  return <div>
    <p className={winOrLoss}>{winOrLoss}</p>
    <p>{`${firstPlayer}    ${point}    ${secondPlayer}`}</p>
    <hr />
    <style jsx>{`
    p {
        margin : 7px;
    }
    .win {
        color : green;
    }

    .loss{
        color : red;
    }

    hr {
        border-top: 0.5px;
        width: 90%;
        margin: auto;
        margin-top: 0px;
        margin-bottom: 5px;
      }
    `}</style>
  </div>;
};

export default EachHistory;
