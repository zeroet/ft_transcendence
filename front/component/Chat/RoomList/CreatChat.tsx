import { useEffect } from "react";

const CreatChat = () => {
  //   useEffect(() => {
  //     const width = window.outerWidth / 2;
  //     const heigth = window.outerHeight / 2;
  //   }, []);
  return (
    <div>
      CreatChat
      <style jsx>{`
        div {
          position: fixed;
          top: 30%;
          left: 30%;

          width: 400px;
          height: 300px;

          background-color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default CreatChat;
