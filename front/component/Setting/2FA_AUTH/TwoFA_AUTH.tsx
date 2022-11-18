import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import useSWR from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import TwoFactor from "../TwoFactor";

const TwoFA_AUTH = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const router = useRouter();
  const { data, error, isValidating } = useSWR("/api/users", fetcher);
  //   console.log(data);
  // state필요없고, get으로 데이터 넣고, post로 업데이트해야한다.
  const [twoFactor, settwoFactor] = useState(false);

  const onClick2FA = useCallback(
    async (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e?.stopPropagation();
      e?.preventDefault();

      await axios.post("/api/profil/otp", {
        set: !data.two_factor,
      });
      router.push("/Home");
    },
    [data.two_factor]
  );

  console.log(data.two_factor);
  
  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Change Name</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <img src="/favicon.ico" width={70} height={70} />
          {data.two_factor === true ? (
            <div className="is-active">ACTIVED</div>
          ) : (
            <div className="is-active">DEACTIVED</div>
          )}
        </div>
        <div className="buttonDiv">
          <button onClick={onClick2FA} className="ok">
            {data.two_factor === false ? "ACTIVATE" : "DEACTIVATE"}
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .buttonDiv {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .is-active {
          color: black;
          font-family: "Doppio One";
          font-style: normal;
          font-weight: 400;
          font-size: 30px;
          line-height: 20px;
          overflow: visible;
          margin: 5px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          // box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
          // height: 100%;
        }
        .submitform {
          margin: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
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
          text-align: center;
          color: red;
        }
        button {
          text-align: center;
          padding-top: 20px;
        }
        .buttonDiv {
          // background-color: yellow;
          margin-top: 10px;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default TwoFA_AUTH;
