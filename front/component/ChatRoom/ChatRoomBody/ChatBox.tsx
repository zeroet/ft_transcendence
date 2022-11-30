import React from "react";

const ChatBox = () => {
  return (
    <form className="chat-box">
      <input type="text" placeholder="ex) casse-toi" />
      <div className="button-div">
        <button>  </button>
      </div>
      <style jsx>{`
        .button-div {
          overflow: visible;
        }
        button {
          float: right;
        }
        .chat-box {
          display: flex;
          flex-direction: column;
          background-color: green;
          margin-left: 10px;
          margin-right: 10px;
          height: 10%;
          border: 3px solid black;
        }
        input {
          background-color: yellow;
          height: 60%;
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
