const SearchBarModal = ({ image, name }: { image: string; name: string }) => {
  return (
    <div className="search-bar-modal">
      <img src={image} width={20} height={20} />
      <div>{name}</div>
      <style jsx>{`
        .search-bar-modal {
          display: flex;
          justify-content: space-around;
          align-items: center;
          border: 1px solid black;
          width: 206px;
          height: 34px;
        }
      `}</style>
    </div>
  );
};

export default SearchBarModal;
