import EachHistory from "./EachHistory";

// interface infoOfHistory {
//   winOrLoss : string,
//   firstPlayer : string,
//   secondPlayer : string,
//   point: string,
// }

const MyHistory = () => {
  // EachHistoty -> 5개만 얻어와서 map으로 출력
  return (
    <div>
      <div className="dummy"></div>
      <div className="history">
        <h1>LAST 5 MATCHES HISTORY</h1>
        <hr className="titleOfHistory" />
        {<EachHistory winOrLoss={'win'} firstPlayer={`hyungyoo`} secondPlayer={'cjung-mo'} point={"5:4"}  />}
        {<EachHistory winOrLoss={'loss'} firstPlayer={`cjung-mo`} secondPlayer={'hyungyoo'} point={"4:1"}  />}
        {<EachHistory winOrLoss={'win'} firstPlayer={`hyungyoo`} secondPlayer={'cjung-mo'} point={"5:4"}  />}
        {<EachHistory winOrLoss={'loss'} firstPlayer={`cjung-mo`} secondPlayer={'hyungyoo'} point={"4:1"}  />}
        {<EachHistory winOrLoss={'win'} firstPlayer={`hyungyoo`} secondPlayer={'cjung-mo'} point={"5:4"}  />}
      </div>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 2fr 4fr;
        }

        h1 {
          width: 100%;
        }

        .titleOfHistory {
          border-top: 2px solid brown;
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
        }
      `}</style>
    </div>
  );
};

export default MyHistory;
