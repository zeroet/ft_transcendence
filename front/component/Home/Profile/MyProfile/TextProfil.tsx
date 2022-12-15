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
    if (rankData === 0) {
      setAchivement("/images/achivement/sesak.png");
    } else if (rankData === 1) {
      setAchivement("/images/achivement/bronze.png");
    } else if (rankData > 1 && rankData <= 3) {
      setAchivement("/images/achivement/silver.png");
    } else {
      setAchivement("/images/achivement/gold.png");
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
      <div className="name">
        <h1 className="userName">
          {user.username}
          {id != myData.id && <span>'s Profile</span>}
        </h1>
      </div>
      <div className="info" onClick={onClickShowImg}>
        <h2>ACHIVEMENT</h2>
        <img src={achivement} width="30px" height="30px" />
      </div>
      {showAchivementExplainModal && (
        <div className="achivement">
          {rankData === 0 && (
            <div>
              <span>Your level: NEWBIE</span>
              <span>Welcome Newbie! Let's play pong!!!</span>
            </div>
          )}
          {rankData === 1 && <h1>You've done 1 pong! Keep it up!</h1>}
          {rankData > 1 && rankData <= 3 && (
            <h1>Almost there! go for gold :D</h1>
          )}
          {rankData > 3 && (
            <div>
              <span>Your level: GOLD</span>
              <span>Best player ever!</span>
            </div>
          )}
        </div>
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
          margin-bottom: 120px;
          margin-left: 7px;
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
