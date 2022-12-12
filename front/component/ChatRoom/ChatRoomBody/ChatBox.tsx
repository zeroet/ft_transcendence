import React, { useEffect } from "react";

interface TypeProps {
  isMute: boolean;
  onChangeInputText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  inputText: string;
}

const ChatBox = ({
  isMute,
  onChangeInputText,
  onClickSubmit,
  inputText,
}: TypeProps) => {
  return (
    <form className="chat-box" method="post">
      <input
        disabled={isMute}
        autoFocus
        onChange={onChangeInputText}
        value={inputText}
        type="text"
        placeholder={!isMute ? "TYPE HERE / ENTER TO SEND" : "MUTED"}
      />
      <div className="button-div">
        <button onClick={onClickSubmit} type="submit">
          <img src="/images/sendMsg.png" width="50px" height="50px" />
        </button>
      </div>
      <style jsx>{`
        .button-div {
          overflow: visible;
        }
        button {
          float: right;
          //   border: 3px solid black;
          cursor: pointer;
        }
        .chat-box {
          display: flex;
          //   flex-direction: column;
          //   background-color: green;
          margin-left: 10px;
          margin-right: 10px;
          height: 10%;
          //   border: 1px solid black;
        }
        input {
          //   background-color: yellow;
          height: 60%;
          width: 90%;
          //   //   margin-left: 10px;
          //   //   margin-right: 10px;
          //   width: 100%;
          border: 3px solid black;
        }
      `}</style>
    </form>
  );
};

export default ChatBox;
