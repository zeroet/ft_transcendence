import Image from "next/image";
import { UserInfo } from "../../../../interfaceType";
import useSWR from "swr";
import Error from "../../../errorAndLoading/Error";
import Loading from "../../../errorAndLoading/Loading";
import fetcher from "../../../Utils/fetcher";
import axios from "axios";

const Photo = () => {
  const { data: user, error } = useSWR<UserInfo>("/api/users", fetcher);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!user) return <Loading />;
  return (
    <div>
      <div className="photo">
        <img height={240} width={240} src={user.image_url} />
      </div>
      <style jsx>{`
        .photo {
          // display: relative;
          width: 203px;
          height: 203px;
          margin: auto;
          margin-top: 50px;
        }

        div {
          overflow: visible;
        }

        img {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Photo;
