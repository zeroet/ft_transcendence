const ChangeNameModal = () => {
    
  return (
    <div className="box">
      <div className="title">
        <h2>Create Chat Room</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <div>
            <input type="text"/>
          </div>
          <div>
            <input
              type="password"
              placeholder="for private room (more than 4 caracters)"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button className="ok">OK</button>
          <button className="cancel">Cancel</button>
        </div>
      </form>
      <style jsx>{`
        .box {
          position: fixed;
          top: 30%;
          left: 37%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          padding-left: 10px;
          background-color: black;
          color: white;
        }
        .submitform {
          // background-color: yellow;
          padding-left: 50px;
          padding-top: 20px;
        }
        input {
          // background-color: tomato;
          font-family: "Fragment Mono", monospace;
          width: 400px;
          height: 30px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 2px solid black;
          outline: none;
          margin-bottom: 20px;
        }
        input::placeholder {
          color: red;
        }
        button {
          text-align: center;
          padding-top: 30px;
        }
        .buttonDiv {
          // background-color: yellow;
          text-align: center;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChangeNameModal;
