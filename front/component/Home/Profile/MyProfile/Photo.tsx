import Image from "next/image";
import { UserInfo } from "../../../../interfaceType";
import useSWR from "swr";
import Error from "../../../errorAndLoading/Error";
import Loading from "../../../errorAndLoading/Loading";
import fetcher from "../../../Utils/fetcher";

const Photo = () => {
  const {
    data: user,
    error,
    isValidating,
  } = useSWR<UserInfo>("/api/users", fetcher);

  if (error) return <Error />;
  if (!user) return <Loading />;
  return (
    <div>
      <div className="photo">
        <img height={200} width={200} src={user.image_url} />
      </div>
      <style jsx>{`
        .photo {
          // display: relative;
          width: 203px;
          height: 203px;
          margin-top: 50px;
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
