import useSWR from "swr";
import fetcher from "../../Utils/fetcher";
import Photo from "./MyProfile/Photo";
import TextProfil from "./MyProfile/TextProfil";

const MyProfil = () => {
  return (
    <div>
      <Photo />
      <TextProfil />
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 2fr 4fr;
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

export default MyProfil;
