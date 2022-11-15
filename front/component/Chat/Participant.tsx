import styles from "../../styles/LayoutBox.module.css";

export default function Participant() {
  return (
    <div className={styles.box}>
      <h1>Participant_chat</h1>
      <hr />
      <ul>
        <li>hyungyoo</li>
        <li>hyungyoo</li>
        <li>hyungyoo</li>
      </ul>
      <style jsx>{`
      h1 {
        font-size: 25px;
        font-weight: 500;
      }
      `}</style>
    </div>
  );
}
