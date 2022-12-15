import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ChangeAvatarModal = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | ArrayBuffer>();

  /**
   * @param event HTMLinput event
   * input의 type이 file일때, event.target.files[0]값이
   *  Blob 객체이다.
   * 먼저, 확장자가 올바른지확인 (예: .sh 파일을 업로드하면 에러가나기때문)
   * FileReader를 이용하여, DataURL로 바꾼다.
   * objetURL(FileReader에 있는 다른 API)는 영속성이 보장되지않음
   * 즉, DB에 이미지를 보내고, 로그인을 다시하면, 값이 변경된다.
   */
  const getNewAvatar = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        // 확장자 추출
        const last_dot = event.target.files[0].name.lastIndexOf(".");
        const extentionOfFile = event.target.files[0].name.substring(
          last_dot + 1
        );
        // 확장자가 png, jpg, jpeg일때만 업로드
        if (
          extentionOfFile === "png" ||
          extentionOfFile === "jpg" ||
          extentionOfFile === "jpeg" ||
          extentionOfFile === "svg"
        ) {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = function (e) {
            if (e.target?.result) {
              console.log(e);
              setAvatar(e.target?.result);
            }
          };
        } else {
          toast.error("File should be PNG, JPG, JPEG or SVG", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: false,
            pauseOnHover: false,
          });
          //   alert("File should be pgn, jpg or");
        }
      }
    },
    []
  );

  /**
   * @param e Button event
   * 얻은 값을 post함 (FileReader로 얻은값)
   */
  const setNewAvatar = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (avatar) {
        try {
          await axios.post("/api/setting/userimage", {
            image_url: avatar,
          });
          mutate("/api/users");
          router.push("/Home");
        } catch (err) {
          console.log(`error for avatar`, err);
          toast.error("File is too big, file should be less than 10kb", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: false,
            pauseOnHover: false,
          });
          //   alert("Size of file is too big, please less than 10kb");
          console.log(e);
        }
      } else {
        toast.error("no file uploaded. Plz upload a file", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: false,
          pauseOnHover: false,
        });
        // alert("no file uploaded. Plz upload a file");
      }
      // modal(e);
    },
    [avatar]
  );

  return (
    <div className="box">
      <div className="title">
        <h2>Change Avatar</h2>
      </div>
      <form className="createForm" method="post">
        {avatar && typeof avatar === "string" && (
          <img
            className="upload-image"
            height={150}
            width={150}
            src={avatar}
            alt="The current file"
          />
        )}
        <div className="upload-file">
          <label className="label" htmlFor="avatar">
            UPLOAD FILE
          </label>
          <img height={27} src={"/images/fileIcon.png"} />
          <input onChange={getNewAvatar} type="file" id="avatar" />
        </div>
        <h1>(less than 10kb && png, jpg, jpeg file only)</h1>
        <div className="buttonDiv">
          <button onClick={setNewAvatar} type="submit" className="ok">
            Submit
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      {/* <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        limit={1}
        style={{ width: "500px", textAlign: "center", fontSize: "15px" }}
        toastStyle={{
          textTransform: "none",
        }}
      /> */}
      <style jsx>{`
        .upload-image {
          border: 2px solid black;
          margin-top: 20px;
        }

        label {
          width: 100%;
          margin-top: 3px;
          color: black;
          cursor: pointer;
        }
        img {
          margin-right: 12px;
          cursor: pointer;
        }
        h1 {
          font-size: 14px;
          color: red;
        }

        .upload-file {
          display: flex;
        }

        .upload-file {
          margin-top: 30px;
          border: 2px solid black;
          width: 250px;
          // display: flex;
        }

        input {
          display: none;
        }

        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 37%;

          width: 500px;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
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
          margin-bottom: 20px;
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
