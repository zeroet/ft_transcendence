import styles from "../../../styles/LayoutBox.module.css";

export default function GameExplain() {
  return (
    <div className={styles.box}>
      <h1>How to play Game</h1>
      <hr />
      <div>여기 설명!</div>
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
