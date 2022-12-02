const EachParticipant = ({ username }: { username: string }) => {
  return (
    <div>
      <div className="user-name">{username}</div>
      <style jsx>{`
        .user-name {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default EachParticipant;
