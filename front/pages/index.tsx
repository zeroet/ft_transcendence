import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [value, setValue] = useState<number>(0);
  const onClickEx = () => {
    setValue((curr) => curr + 1);
  };
  const getData = async () => {
    const data = axios
      .get("http://localhost/api")
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.container}>
      <h2>gooooooooooooood !!!!!: {value}</h2>
      <button onClick={onClickEx}>+</button>
    </div>
  );
}
