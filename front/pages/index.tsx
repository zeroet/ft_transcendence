import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";

const fetcher = async (url : string) => {
  return axios.get(url).then(res => res.data).catch(res => res.data);
}

export default function Home() {
  const {data, error, isValidating} = useSWR('/api/test', fetcher)
  
  if (error) return ;
  return (
    <div className={styles.container}>
      <h1>{!isValidating && data}</h1>
    </div>
  );
}
