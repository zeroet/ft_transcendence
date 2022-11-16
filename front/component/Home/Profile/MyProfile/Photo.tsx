import Image from "next/image";
import useSWR from "swr";
import fetcher from "../../../Utils/fetcher";

const Photo = () => {
  const user = useSWR("/api/users", fetcher);
  console.log(user);
  const defaultImage = "/images/default_image.jpg";
  return (
    <div>
      <div className="photo">
        <img height={250} src={defaultImage} />
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
