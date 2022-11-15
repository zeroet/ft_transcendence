const MyHistory = () => {
  return (
    <div>
      <div className="dummy"></div>
      <div className="history">
        <h1>LAST 5 MATCHES HISTORY</h1>
        <hr className="titleOfHistory"/>
        <p>gh</p>
      </div>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 2fr 4fr;
        }

        h1 {
            width : 100%;
        }

        .titleOfHistory {
            border-top: 2px solid brown;
        }

        hr {
            border-top: 1px solid;
            width : 90%;
            margin: auto;
            margin-top : 0px;
            margin-bottom: 0px;
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
