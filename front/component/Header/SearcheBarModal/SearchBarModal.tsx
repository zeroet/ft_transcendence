import React, { useCallback } from "react";

const SearchBarModal = ({
  setInputValue,
  image,
  name,
}: {
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  image: string;
  name: string;
}) => {
  const onClickAddFriend = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      alert("버튼누르면 바로 api 친구추가요청");
      setInputValue("");
    },
    []
  );
  return (
    <div className="search-bar-modal">
      <img src={image} width={20} height={20} />
      <div>{name}</div>
      <button onClick={onClickAddFriend} className="add-button">
        Add
      </button>
      <style jsx>{`
        .add-button {
          font-family: "Fragment Mono", monospace;
          font-size: 15px;
          color: white;
          background-color: black;
          border: 1px solid black;
          cursor: pointer;
        }
        .search-bar-modal {
          display: flex;
          justify-content: space-around;
          align-items: center;
          border: 1px solid black;
          width: 206px;
          height: 34px;
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

export default SearchBarModal;
