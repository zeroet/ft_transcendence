import React, { useCallback, useState } from "react";
import TwoFA_AUTH from "./2FA_AUTH/TwoFA_AUTH";

const TwoFactor = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const modal = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal((curr) => !curr);
  };
  return (
    <div className="setting-component">
      {showModal && (
        <div className="modal-background">
          <TwoFA_AUTH modal={modal} />
        </div>
      )}
      <div className="div-lettre" onClick={modal}>
        2FA AUTHENTICIATION
      </div>
      <style jsx>
        {`
          .div-lettre {
            font-family: "Fragment Mono", monospace;
            font-weight: bold;
            overflow: visible;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          .modal-background {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
          }
        `}
      </style>
    </div>
  );
};

export default TwoFactor;
