import Photo from "./MyProfile/Photo";
import TextProfil from "./MyProfile/TextProfil";

const MyProfil = ({ id }: { id: number }) => {
  return (
    <div>
      <Photo id={id} />
      <TextProfil id={id} />
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
