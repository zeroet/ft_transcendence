import Link from "next/link";

export default function Footer() {
  return (
    <div
      style={{
        backgroundColor: "white",
        marginTop: 40,
        borderTop: "1px solid #999",
        textAlign: "center",
        width: "100%",
      }}
    >
      <p className="text">
        ft_transcendence by{" "}
        <span>
          <Link
            href="https://profile.intra.42.fr/users/cjung-mo"
            legacyBehavior
          >
            <a target="_blank">@cjung-mo </a>
          </Link>
        </span>
        <span>
          <Link href="https://profile.intra.42.fr/users/eyoo" legacyBehavior>
            <a target="_blank">@eyoo </a>
          </Link>
        </span>
        <span>
          <Link
            href="https://profile.intra.42.fr/users/hyungyoo"
            legacyBehavior
          >
            <a target="_blank">@hyungyoo </a>
          </Link>
        </span>
        <span>
          <Link href="https://profile.intra.42.fr/users/keulee" legacyBehavior>
            <a target="_blank">@keulee </a>
          </Link>
        </span>
        <span>
          <Link href="https://profile.intra.42.fr/users/seyun" legacyBehavior>
            <a target="_blank">@seyun </a>
          </Link>
        </span>
      </p>
      <style jsx>{`
        a {
          color: black;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
