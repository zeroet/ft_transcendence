// 나중에 submit으로 주기위해서 form 으로
// 변경해야함

const SearchBar = () => {
  return (
    <div className="searchBar">
      <div className="bar">
        <div>
          <input className="barInput" placeholder="username" type={"text"} />
        </div>
        <img height={27} src={"/images/search.png"} />
      </div>
      <style jsx>{`
        div {
          margin-right: 20px;
          overflow: visible;
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
