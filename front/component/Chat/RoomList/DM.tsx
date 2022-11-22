import useSWR from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import DmRoom from "./DmRoom";

export default function DM() {
  const { data, error } = useSWR(`https://dummyjson.com/posts/`, fetcher);

  if (data) {
    console.log(data);
  }
  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <div className="DM">
      <h1>DM</h1>
      <hr />
      {
        <ul key={data.posts.id}>
          {data.posts && 
            data.posts.map((post: any) => 
            <li>
              <DmRoom title={post.title} id={post.id}/>
            </li>
            )}
        </ul>
      }
      <style jsx>
        {`
          h1 {
            font-family: "Fragment Mono", monospace;
            font-weight: bold;
            font-size: 25px;
            line-height: 20px;
            margin-left: 10px;
            /* identical to box height, or 67% */
            text-transform: uppercase;
          }
          .DM {
            height: 50%;
          }
          
        `}
      </style>
    </div>
  );
}
