// 방 관리자일때와 아닐때를 나눠야함.
// 우선 일반적인 경우 -> exit the room 만 기본설정으로

export default function ChatroomSettingModal({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) {
  return (
    <div>
      <div className="box">
        <h1>Exit the room</h1>
      </div>
      <style jsx>{`
        .box {
          font-family: "Fragment Mono", monospace;
          position: absolute;
          top: 18%;
          left: 57.8%;

          width: 200px;
          height: 47px;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
          cursor: pointer;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          font-weight: bold;
        }
        hr {
        }
      `}</style>
    </div>
  );
}
