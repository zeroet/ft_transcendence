import axios from "axios";
import { useRouter } from "next/router";

const Logout = () => {
  const router = useRouter();
  const logout = () => {
    axios.get("/api/auth/logout");
    router.push("/");
  };
  return (
    <div onClick={logout} className="setting-component">
      Logout
    </div>
  );
};

export default Logout;
