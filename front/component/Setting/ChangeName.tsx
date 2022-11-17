import { useState } from "react";
import ChangeNameModal from "./ChangeName/ChangeNameModal";

const ChangeName = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const modal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowModal((curr) => !curr);
  };
  return (
    <div onClick={modal} className="setting-component">
      {showModal && <ChangeNameModal />}
      ChangeName
    </div>
  );
};

export default ChangeName;
