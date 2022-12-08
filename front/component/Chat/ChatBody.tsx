import styles from "../../styles/LayoutBox.module.css";

export default function ChatBody() {
  return (
    <div className={styles.box}>
      <h1>Chat</h1>
      <hr />
      <div className="c-body">
        <h1>create / select a room</h1>
      </div>
      <style jsx>
        {`
          h1 {
            font-family: "Fragment Mono", monospace;
            font-size: 25px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 10px;
          }
          .c-body {
            height: 90%;
            margin-left: 10px;
            margin-right: 10px;
            // background-color: tomato;
            text-align: center;
          }
          .c-body h1 {
            // background-color: blue;
            padding: 35% 0;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
