import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";

const SearchBarModal = ({
  setInputValue,
  image,
  name,
  id,
}: {
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  image: string;
  name: string;
  id: number;
}) => {
  const { data: userData, error: userError } = useSWR("/api/users");
  const { data: friendListData, error: friendListError } = useSWR(
    `/api/users/friend/list`
  );
  const [addOrDelete, setAddOrDelete] = useState("Add");

  const onClickAddOrDeleteFriend = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(name);
      if (addOrDelete === "Add") {
        await axios
          .post(`/api/users/friend/${id.toString()}`)
          .then(() => {
            mutate(`/api/users/friend/list`);
            setAddOrDelete("Delete");
          })
          .catch((err) => console.log(err));
      } else {
        await axios
          .delete(`/api/users/friend/${id.toString()}`)
          .then(() => {
            mutate(`/api/users/friend/list`);
            setAddOrDelete("Delete");
          })
          .catch((err) => console.log(err));
      }
      setInputValue("");
    },
    [addOrDelete, friendListData, userData]
  );

  useEffect(() => {
    console.log("search bar");
    if (!friendListData || !userData) return;
    friendListData.map((friend: any) => {
      if (friend.friendUserId === id) {
        setAddOrDelete("Delete");
      }
    });
  }, [addOrDelete, friendListData, userData]);

  if (!userData || !friendListData) return <Loading />;
  return (
    <div className="search-bar-modal">
      <img src={image} width={20} height={20} />
      <div>{name}</div>
      {/* 친구등록상태이면 Delete, 아니면 ADD */}
      {name !== userData.username && (
        <button onClick={onClickAddOrDeleteFriend} className="add-button">
          {addOrDelete}
        </button>
      )}
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
