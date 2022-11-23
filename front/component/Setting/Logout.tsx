import axios from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Logout = () => {
  const router = useRouter();
  const logout = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await axios
      .post("/api/two-factor/valid", { valid: false })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    await axios.get("/api/auth/logout", {
      headers: { "Cache-Control": "no-cache" },
    });
    router.push("/");
  }, []);

  return (
    <div onClick={logout} className="setting-component">
      <div className="div-lettre">Logout</div>
      <style jsx>{`
        .div-lettre {
          font-family: "Fragment Mono", monospace;
          font-weight: bold;
          overflow: visible;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Logout;
