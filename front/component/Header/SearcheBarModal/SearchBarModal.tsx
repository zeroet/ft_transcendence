import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";

const SearchBarModal = ({
  setInputValue,
  image,
  name,
  id,
  setShowEverything,
}: {
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  image: string;
  name: string;
  id: number;
  setShowEverything: React.Dispatch<React.SetStateAction<boolean>>;
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
        console.log("in add");
        toast.info(`${name} is added on friend list`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: true,
        });
        await axios
          .post(`/api/users/friend/${id.toString()}`)
          .then(() => {
            mutate(`/api/users/friend/list`);
            setAddOrDelete("Delete");
          })
          .catch((err) => console.log(err));
      } else if (addOrDelete === "Delete") {
        console.log("in delete");
        toast.info(`${name} is deleted from friend list`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: true,
        });
        await axios
          .delete(`/api/users/friend/${id.toString()}`)
          .then(() => {
            mutate(`/api/users/friend/list`);
            setAddOrDelete("Add");
          })
          .catch((err) => console.log(err));
      }
      setInputValue("");
      setShowEverything(false);
    },
    [addOrDelete, friendListData, userData]
  );

  useEffect(() => {
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
      {name !== userData.username && (
        <button onClick={onClickAddOrDeleteFriend} className="add-button">
          {addOrDelete}
        </button>
      )}
      {name === userData.username && <div className="vide"></div>}
      <style jsx>{`
        .add-button {
          font-family: "Fragment Mono", monospace;
          font-size: 10px;
          color: white;
          background-color: black;
          border: 1px solid black;
          cursor: pointer;
          margin-right: 2px;
        }
        .vide {
          width: 30px;
        }
        .search-bar-modal {
          display: flex;
          justify-content: space-between;
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
