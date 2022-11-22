import styles from "../../styles/LayoutBox.module.css";
import useSWR from "swr";
import fetcher from "../Utils/fetcher";
import Error from "../errorAndLoading/Error";
import Loading from "../errorAndLoading/Loading";

// participant는 따로 모달을 만듬
// useRouter로 어디있는지에 한에서 나오는 버튼의 수를 조절함
// participant은 게임, 프로필, 채팅등에서 유저목록이 들어가는 모든곳에
// 중복으로 사용됨. 물론 중복으로 사용안해도됨

export default function Participant() {
  const { data, error } = useSWR(`https://dummyjson.com/posts/`, fetcher);

  if (data) {
    console.log(data);
  }
  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <div className={styles.box}>
      <h1>Participant</h1>
      <hr />
      {
        <ul key={data.posts.id}>
          {data.posts && data.posts.map((post: any) => <li>{post.id}</li>)}
        </ul>
      }
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
