import styles from "../../styles/LayoutBox.module.css";

// participant 는 따로 모달을 만듬
// useRouter로 어디있는지에 한에서 나오는 버튼의 수를 조절함
// participant은 게임, 프로필, 채팅등에서 유저목록이 들어가는 모든곳에
// 중복으로 사용됨. 물론 중복으로 사용안해도됨

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
