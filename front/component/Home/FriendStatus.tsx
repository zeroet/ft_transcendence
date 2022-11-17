import styles from "../../styles/LayoutBox.module.css";

export default function FriendStatus() {
  return (
    <div className={styles.box}>
      <h1>Friend Status</h1>
      <hr />
      <ul>
        <li>hyungyoo1</li>
        <li>hyungyoo2</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
        <li>hyungyoo3</li>
      </ul>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
        }
      `}</style>
    </div>
  );
}