import { useRouter } from "next/router";

const Logout = () => {
  const router = useRouter();
  const logout = () => {
    router.push("/api/auth/logout");
  };
  return (
    <div onClick={logout} className="setting-component">
      Logout
    </div>
  );
};

export default Logout;
