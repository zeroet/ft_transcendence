import styles from "../../styles/LayoutBox.module.css";

export default function FriendStatus({ id }: { id: string }) {
  /**
   * id === -1이면 내정보
   */
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
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
