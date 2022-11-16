import Image from "next/image";
import useSWR from "swr";
import fetcher from "../../../Utils/fetcher";

const Photo = () => {
  const {data, error, isValidating} = useSWR('/api/users', fetcher);
  // 나중에  data : user로 바꿔야함
  const user = data[0];
  const {image_url} = user;
  const defaultImage = image_url;
  return (
    <div>
      <div className="photo">
        <img height={200} src={defaultImage} />
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
