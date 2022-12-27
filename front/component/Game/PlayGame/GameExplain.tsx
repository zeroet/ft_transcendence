import styles from "../../../styles/LayoutBox.module.css";

export default function GameExplain() {
  return (
    <div className={styles.box}>
      <h1>How to play</h1>
      <hr />
      <div className="explain">
        <div>{`<How to win the game>`}</div>
        <div>Player who wins 5 times first wins!</div>
        <div>{`<key>`}</div>
        <div>W: go upside</div>
        <div>S: go downside</div>
      </div>
      <style jsx>{`
        .room-name {
          padding-left: 30px;
          margin-top: 15px;
        }
        strong {
          font-size: 20px;

          color: black;
        }
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
