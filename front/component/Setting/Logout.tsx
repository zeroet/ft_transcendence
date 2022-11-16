import Link from "next/link";

const Logout = () => {
  return (
    <Link href="/api/auth/logout">
      <div className="setting-component">Logout</div>
    </Link>
  );
};

export default Logout;
