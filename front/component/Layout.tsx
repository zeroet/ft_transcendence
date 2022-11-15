import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function Layout({ children }: { children: any }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
