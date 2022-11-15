import Layout from "../component/Layout";
import Title from "../component/Title";
import styles from "../styles/LayoutBox.module.css";

export default function Setting() {
  return (
    <Layout>
      <Title title="Setting" />
      <div className={styles.setting}>
       <h1>존나 졸림 ㅅㅂ</h1>
      </div>
    </Layout>
  );
}
