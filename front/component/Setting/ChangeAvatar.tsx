import React, { useCallback, useState } from "react";
import ChangeAvatarModal from "./ChangeAvatar/ChangeAvatarModal";

const ChangeAvatar = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const modal = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e.stopPropagation();
      e.preventDefault();
      setShowModal((curr) => !curr);
    },
    [showModal]
  );

  return (
    <div className="setting-component">
      {showModal && (
        <div className="modal-background">
          <ChangeAvatarModal modal={modal} />
        </div>
      )}
      <div className="div-lettre" onClick={modal}>
        Change Avatar
      </div>
      <style jsx>{`
        .div-lettre {
          font-family: "Fragment Mono", monospace;
          font-weight: bold;
          overflow: visible;
          height: 100%;
          text-transform: uppercase;
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
      `}</style>
    </div>
  );
};

export default ChangeAvatar;
