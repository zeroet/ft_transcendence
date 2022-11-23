import axios from "axios";

const Error = () => {
  axios.get("/api/auth/refresh");
  return (
    <div>
      <h1 className="errorAndLoading">failed to load</h1>
    </div>
  );
};

export default Error;
