import React from "react";

const ChatBox = () => {
  return (
    <form className="chat-box">
      <input type="text" placeholder="ex) casse-toi" />
      <div className="button-div">
        <button type="submit">
          <img src="/images/allow.jpeg" width="25px" height="25px" />
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
          flex-direction: column;
          //   background-color: green;
          margin-left: 10px;
          margin-right: 10px;
          height: 10%;
          //   border: 1px solid black;
        }
        input {
          //   background-color: yellow;
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
