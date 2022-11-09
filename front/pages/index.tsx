import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [value, setValue] = useState<number>(0);
  const onClickEx = () => {
    setValue((curr) => curr + 1);
  };
  return (
    <div className={styles.container}>
      <h2>gooooooooooooood !!!!!: {value}</h2>
      <button onClick={onClickEx}>+</button>
    </div>
  );
}
