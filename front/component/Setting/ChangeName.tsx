import { useState } from "react";
import ChangeNameModal from "./ChangeName/ChangeNameModal";

const ChangeName = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const modal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowModal((curr) => !curr);
  };
  return (
    <div className="setting-component">
      {showModal && <ChangeNameModal />}
      <div className="div-lettre" onClick={modal}>
        ChangeName
      </div>
      <style jsx>
        {`
          .div-lettre {
            overflow: visible;
          }
        `}
      </style>
    </div>
  );
};

export default ChangeName;
