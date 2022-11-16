import Image from "next/image";
import useSWR from "swr";
import fetcher from "../../../Utils/fetcher";

const Photo = () => {
  const { data: user, error, isValidating } = useSWR("/api/users", fetcher);
  
  if (error) return <div>failed to load</div>;
  if (!user) return <div>loading...</div>;
  return (
    <div>
      <div className="photo">
        <img height={200} src={user.image_url} />
      </div>
      <style jsx>{`
        .photo {
          // display: relative;
          width: 203px;
          height: 203px;
          margin-top: 48px;
          margin-left: auto;
          margin-right: auto;
        }

        div {
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

export default Photo;
