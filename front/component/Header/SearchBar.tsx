import React, { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import Loading from "../errorAndLoading/Loading";
import SearchBarModal from "./SearcheBarModal/SearchBarModal";
import { UserInfo } from "../../interfaceType";
import axios from "axios";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const { data, error } = useSWR("/api/users/all");
  const [showEverything, setShowEverything] = useState<boolean>(false);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
      setInputValue(e?.target.value);
    },
    []
  );

  const onClickInputValue = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setShowEverything((curr) => !curr);
    },
    [inputValue]
  );

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div className="searchBar">
      <div className="bar">
        <div>
          <input
            onChange={onChangeInput}
            className="barInput"
            placeholder="ex) Hyungyoo"
            type={"text"}
            value={inputValue}
          />
        </div>
        <img
          onClick={onClickInputValue}
          height={27}
          src={"/images/search.png"}
        />
      </div>
      <div>
        <div className="user-list">
          {data &&
            inputValue &&
            data.map((user: UserInfo) => {
              if (user.username.toLowerCase().includes(inputValue)) {
                return (
                  <div key={user.intra_id}>
                    <SearchBarModal
                      setInputValue={setInputValue}
                      image={user.image_url}
                      name={user.username}
                      id={user.id}
                      setShowEverything={setShowEverything}
                    />
                  </div>
                );
              }
            })}
          {data &&
            !inputValue &&
            showEverything &&
            data.map((user: UserInfo) => {
              return (
                <div key={user.intra_id}>
                  <SearchBarModal
                    setInputValue={setInputValue}
                    image={user.image_url}
                    name={user.username}
                    id={user.id}
                    setShowEverything={setShowEverything}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <style jsx>{`
        .user-list {
          position: absolute;
          background-color: white;
        }

        div {
          margin-right: 20px;
          overflow: visible;
        }

        .searchBar {
          padding: 0px;
          margin: 0px;
          display: grid;
          justify-content: center;
          align-content: center;
        }

        .bar {
          display: inline-flex;
          margin-top: 25px;
        }

        .barInput {
          background: #ffffff;
          border: 1px solid #000000;
          height: 30px;
          width: 200px;
          outline: none;
          box-shadow: 5px 5px;
        }
        img {
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
