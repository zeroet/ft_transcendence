import useSWR, { mutate } from "swr";
import Loading from "../../../errorAndLoading/Loading";
import { UserInfo } from "../../../../interfaceType";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const TextProfil = ({ id }: { id: number }) => {
  const { data: user, error } = useSWR<UserInfo>(`/api/users/${id}`);
  const { data: myData, error: myError } = useSWR<UserInfo>(`/api/users`);
  const userNameFontSize = { size: 50 };
  const { data: rankData, error: rankError } = useSWR(`/api/users/rank/${id}`);
  const [showAchivementExplainModal, setShowAchivementExplainModal] =
    useState(false);
  const [achivement, setAchivement] = useState("");

  if (user && user.username.length >= 20) {
    userNameFontSize.size = 25;
  }

  const onClickShowImg = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowAchivementExplainModal((curr) => !curr);
    },
    [myData, rankData]
  );

  useEffect(() => {
    if (rankData < 10) {
      setAchivement("/images/achivement/achivement.png");
    } else if (rankData > 10 && rankData < 100) {
      setAchivement("/images/achivement/2.png");
    } else if (rankData > 100 && rankData < 1000) {
      setAchivement("/images/achivement/3.png");
    } else {
      setAchivement("/images/achivement/4.png");
    }
  }, [rankData, myData]);

  useEffect(() => {
    mutate(`/api/users/rank/${id}`);
  }, [myData]);

  if (error || myError || rankError)
    axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!user || !myData) return <Loading />;
  return (
    <div>
      {id != myData.id && <h3>You see {user.intra_id}'s Profile</h3>}
      <div className="name">
        <h1 className="userName">{user.username}</h1>
      </div>
      <div className="info" onClick={onClickShowImg}>
        <h2>ACHIVEMENT</h2>
        <img src={achivement} width="30px" height={"30px"} />
      </div>
      {showAchivementExplainModal && (
        <div className="achivement">achivement 소개</div>
      )}
      <style jsx>{`
        div {
          display: grid;
          margin-left: 5px;
        }
        img {
          margin-left: 10px;
          cursor: pointer;
        }
        .userName {
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: bold;
          font-size: ${userNameFontSize.size}px;
          line-height: 20px;
          /* or 40% */
          text-transform: uppercase;
          color: #000000;
        }
        h3 {
          font-family: "Fragment Mono", monospace;
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 30px;
          /* or 150% */
          text-transform: uppercase;
          margin: 0px;
        }
        .victory {
          color: green;
        }
        .loss {
          color: red;
        }
        .name {
          margin-top: 48px;
          overflow: hidden;
        }
        .info {
          display: flex;
          align-items: center;
          margin-bottom: 100px;
          margin-left: 10px;
          //   background-color: yellow;
          cursor: pointer;
        }
        .achivement {
          //   background-color: red;
          margin-top: -110px;
          margin-left: 10px;
          //   border: 1px solid black;
        }
      `}</style>
    </div>
  );
};

export default TextProfil;
