import styles from "../../styles/LayoutBox.module.css";

export default function GameList() {
  return (
    <div className={styles.box}>
      <h1>Game List</h1>
      <hr />
      <ul>
        <li>game list 1</li>
        <li>game list 2</li>
        <li>game list 3</li>
      </ul>
    </div>
  );
}