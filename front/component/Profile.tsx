import axios from "axios";
import useSWR from "swr";
import styles from "../styles/LayoutBox.module.css";

const fetcher = async (url: string) => {
  return await axios.get(url).then((response) => response.data);
};

export default function Profile(): JSX.Element {
  const { data, isValidating } = useSWR("/api/test", fetcher);

  return (
    <div className={styles.box}>
      <h1>Profile component</h1>
      <h1>{!isValidating && data}</h1>
    </div>
  );
}
