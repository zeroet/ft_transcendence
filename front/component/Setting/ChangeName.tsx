import { useState } from "react";
import ChangeNameModal from "./ChangeName/ChangeNameModal";

const ChangeName = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const modal = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement> ) => {
    e.preventDefault();
    setShowModal((curr) => !curr);
  };
  return (
    <div className="setting-component">
      {showModal && <ChangeNameModal modal={modal} />}
      <div className="div-lettre" onClick={modal}>
        ChangeName
      </div>
      <style jsx>
        {`
          .div-lettre {
            overflow: visible;
            width: 100%;
            higth: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default ChangeName;
