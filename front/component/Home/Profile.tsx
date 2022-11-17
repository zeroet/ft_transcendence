import axios from "axios";
import styles from "../../styles/LayoutBox.module.css";
import MyHistory from "./Profile/MyHistory";
import MyProfil from "./Profile/MyProfil";

export default function Profile() {
  return (
    <div className="div">
      <MyProfil />
      <MyHistory />
      <style jsx>{`
        div {
          display: grid;
          grid-template-rows: 1.5fr 2.5fr;
          margin: 20px;
          border: 1px inset black;
          box-shadow: 10px 10px;
          height: 740px;
        }
      `}</style>
    </div>
  );
}
