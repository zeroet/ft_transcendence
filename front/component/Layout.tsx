import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { ReactNode } from "react";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div>
      {router.pathname !== "/Chat" && router.pathname !== "/Game/[id]" && (
        <Header id={undefined} />
      )}

      <div>{children}</div>
      <Footer />
    </div>
  );
}
