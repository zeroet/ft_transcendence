import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { mutate } from "swr";

const ChangeAvatarModal = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const router = useRouter();
  // const [avatar, setAvatar] = useState<Blob>();
  const [avatar, setAvatar] = useState<string>();

  const getNewAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // formData.append("image_url", file.name);
      console.log(event.target.files[0]);
      setAvatar(URL.createObjectURL(event.target.files[0]));
      // setAvatar(event.target.files[0])
      // console.log(typeof URL.createObjectURL(event.target.files[0]));
      // URL.revokeObjectURL(event.target.files[0]);
    }
  };

  console.log(avatar);

  const setNewAvatar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (avatar) {
      axios
        .post("/api/setting/userimage", {
          image_url: avatar,
        })
        .then(() => {
          router.push("/Home");
        })
        .catch((err) => console.log(`error for avatar`, err));
    } else {
      modal(e);
    }
  };

  // {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     withCredentials: 'true',
  //   },
  // })

  return (
    <div className="box">
      <div className="title">
        <h2>Change Avatar</h2>
      </div>
      <form className="createForm" method="post">
        {avatar ? (
          <img
            className="upload-image"
            height={150}
            width={150}
            src={avatar}
            alt="The current file"
          />
        ) : (
          <div className="upload-file">
            <img height={27} src={"/images/search.png"} />
            <label className="label" htmlFor="avatar">
              UPLOAD FILE
            </label>
            <input onChange={getNewAvatar} type="file" id="avatar" />
          </div>
        )}
        <div className="buttonDiv">
          <button onClick={setNewAvatar} type="submit" className="ok">
            Submit
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .upload-image {
          border: 2px solid black;
        }

        label {
          width: 100%;
          margin-top: 3px;
          color: black;
        }

        .upload-file {
          display: flex;
        }

        .upload-file {
          margin-top: 30px;
          margin-bottom: 30px;
          border: 2px solid black;
          width: 250px;
          display: flex;
        }

        input {
          display: none;
        }

        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          // box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
          // height: 100%;
        }

        .createForm {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
        }

        // input::placeholder {
        //   text-align: center;
        //   color: red;
        // }

        button {
          text-align: center;
          padding-top: 20px;
        }
        .buttonDiv {
          // background-color: yellow;
          margin-top: 10px;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChangeAvatarModal;
