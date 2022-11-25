import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import styles from "styles/Gnb.module.css";
import SearchBar from "./SearchBar";

export default function Gnb() {
  const router = useRouter();
  // const router = useRouter();
  const onClickImg42 = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/");
  }, []);
  return (
    <div className="header">
      <nav className={styles.navbar}>
        <img
          onClick={onClickImg42}
          src="/images/42Logo.png"
          alt="42logo"
          className={styles.logo}
        />
        <ul className={styles.navbar_menu}>
          <li>
            <Link href="/Home" legacyBehavior>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/Chat" legacyBehavior>
              <a>Chat</a>
            </Link>
          </li>
          <li>
            <Link href="/Game" legacyBehavior>
              <a>Game</a>
            </Link>
          </li>
          <li>
            <Link href="/Setting" legacyBehavior>
              <a>Setting</a>
            </Link>
          </li>
        </ul>
        {/* <form className={styles.search}>
          <input type="text" placeholder="Search"></input>
        </form> */}
      </nav>
      <SearchBar />
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        img {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
