import React, { useCallback, useState } from "react";
import useSWR from "swr";
import Error from "../errorAndLoading/Error";
import Loading from "../errorAndLoading/Loading";
import fetcher from "../Utils/fetcher";
import SearchBarModal from "./SearcheBarModal/SearchBarModal";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string | undefined>("");

  /**
   * dummy data
   */
  const { data, error, isValidating } = useSWR(
    "https://dummyjson.com/users",
    fetcher
  );

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
      console.log(inputValue);
      setInputValue("");
    },
    [inputValue]
  );

  if (error) return <Error />;
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
          />
        </div>
        <img
          onClick={onClickInputValue}
          height={27}
          src={"/images/search.png"}
        />
      </div>
      {data.users &&
        inputValue !== "" &&
        data.users.map((user: any) => {
          if (user.firstName.includes(inputValue)) {
            return (
              <div key={user.id}>
                <SearchBarModal image={user.image} name={user.firstName} />
              </div>
            );
          }
        })}
      <style jsx>{`
        div {
          margin-right: 20px;
          overflow: hidden;
        }

        .searchBar {
          padding: 0.4rem;
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
