import styles from "../../styles/LayoutBox.module.css";

export default function ChatBody() {
  return (
    <div className={styles.box}>
      <h1>Chat</h1>
      <hr />
      <style jsx>
        {`
          h1 {
            font-family: "Fragment Mono", monospace;
            font-size: 25px;
            text-transform: uppercase;
          }
        `}
      </style>
    </div>
  );
}
