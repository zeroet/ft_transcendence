const EachParticipant = ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
  console.log(
    "Each participant에서 userId는 유저정보를 불러오거나 API를 사용할때! 위함"
  );
  return (
    <div>
      <div>{username}</div>
      <style jsx>{``}</style>
    </div>
  );
};

export default EachParticipant;
