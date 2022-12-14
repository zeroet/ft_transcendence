import { UserInfo } from "../../../../interfaceType";
import useSWR from "swr";
import Loading from "../../../errorAndLoading/Loading";
import axios from "axios";

const Photo = ({ id }: { id: number }) => {
  const { data: user, error } = useSWR<UserInfo>(`/api/users/${id}`);

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!user) return <Loading />;
  return (
    <div>
      <div className="photo">
        <img width="100%" height="auto" src={user.image_url} />
      </div>
      <style jsx>{`
        .photo {
          //   background-color: red;
          max-width: 250px;
          height: auto;
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
