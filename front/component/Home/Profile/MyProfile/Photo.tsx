import Image from "next/image";

const Photo = () => {
    const defaultImage = '/images/default_image.jpg';
  return (
    <div>
      <div className="photo">
        <img height={250} src={defaultImage}/>
      </div>
      <style jsx>{`
        .photo {
            // display: relative;
            width: 203px;
            height: 203px;
            margin-top : 48px;
            margin-left: auto;
            margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default Photo;
