import { useState } from "react";
import ChangeNameModal from "./ChangeName/ChangeNameModal";

const ChangeName = () => {
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
          <ChangeNameModal modal={modal} />
        </div>
      )}
      <div className="div-lettre" onClick={modal}>
        Change Name
      </div>
      <style jsx>
        {`
          .div-lettre {
            font-family: "Fragment Mono", monospace;
            font-weight: bold;
            overflow: visible;
            width: 100%;
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
        `}
      </style>
    </div>
  );
};

export default ChangeName;
