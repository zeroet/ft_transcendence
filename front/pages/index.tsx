import axios from "axios";
import cookies from "next-cookies";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { XYType } from "../interfaceType";
import { GetServerSideProps } from "next";

export default function Enter({ path }: { path: string }) {
  const router = useRouter();
  const [_, setRerender] = useState(0);
  const ball = useRef<XYType>({
    x: 50,
    y: 50,
  });

  const ballDirection = useRef<XYType>({
    x: 1,
    y: 1,
  });

  const onClickLink = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.get(path, {
        headers: {
          "Cache-Control": "max-age=0",
        },
      });
      router.push("/Home");
    } catch (err) {
      console.log(err);
      router.push("/api/auth/signup");
    }
  };

  const ballMovement = () => {
    if (
      ball.current.x <= 2 ||
      ball.current.x >= 94 ||
      ball.current.y <= 0 ||
      ball.current.y >= 97
    ) {
      if (ball.current.x <= 2) {
        ballDirection.current.x *= -1;
        ball.current.x += 1;
      }
      if (ball.current.x >= 94) {
        ballDirection.current.x *= -1;
        ball.current.x -= 1;
      }
      if (ball.current.y <= 0) {
        ballDirection.current.y *= -1;
        ball.current.y += 1;
      }
      if (ball.current.y >= 97) {
        ballDirection.current.y *= -1;
        ball.current.y -= 1;
      }
    }
    ball.current.x += ballDirection.current.x * 0.2;
    ball.current.y += ballDirection.current.y * 0.2;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      ballMovement();
      setRerender((curr) => curr + 1);
    }, 5);
    return () => clearInterval(timer);
  }, []);

  /** test용 */
  const test = async () => {
    try {
      await axios
        .get("/api/auth/dummy", { headers: { "Cache-Control": "max-age=0" } })
        .then(console.log);
      router.push("/Home");
    } catch (err) {
      console.log(err);
    }
  };
  const selectedUser = async (e: any) => {
    console.log(e.target.value);
    try {
      await axios
        .post("/api/auth/test", {
          headers: { "Cache-Control": "max-age=0" },
          name: e.target.value,
        })
        .then(console.log);
      router.push("/Home");
    } catch (err) {
      console.log(err);
    }
  };
  /** test용 */

  return (
    <div>
      <Head>
        <title>ft_transcendence</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <div className="ball"></div>
        {path === "/api/auth/login" ? (
          <div>
            <img
              onClick={onClickLink}
              src="/images/Group.png"
              alt="enterImg"
              className="enterImg"
            />
          </div>
        ) : (
          <Link href={path}>
            <img src="/images/Group.png" alt="enterImg" className="enterImg" />
          </Link>
        )}
        {/* 테스트용 */}
        <button onClick={test}>+</button>
        <select name="test_user" onChange={selectedUser}>
          <option value="">Test user</option>
          <option value="Janvier">Janvier</option>
          <option value="Fevrier">Fevrier</option>
          <option value="Mars">Mars</option>
          <option value="Avril">Avril</option>
          <option value="Mai">Mai</option>
          <option value="Juin">Juin</option>
        </select>
        {/* 테스트용 */}
        <style jsx>{`
          div {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .enterImg {
            height: 150px;
            cursor: pointer;
          }

          :root {
            --hue: 200;
            --saturation: 0%;
            --foreground-color: hsl(var(--hue), var(--saturation), 75%);
            --background-color: hsl(var(--hue), var(--saturation), 20%);
          }

          .ball {
            --x: ${ball.current.x};
            --y: ${ball.current.y};

            position: absolute;
            background-color: black;
            left: calc(var(--x) * 1vw);
            top: calc(var(--y) * 1vh);
            trasform: traslate(-50%, -50%);
            border-radius: 50%;
            width: 2.5vh;
            height: 2.5vh;
          }
        `}</style>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (accessToken && refreshToken) {
    return {
      redirect: {
        destination: "/Home",
        permanent: false,
      },
    };
  } else if (!accessToken && !refreshToken) {
    return {
      props: {
        path: "/api/auth/signup",
      },
    };
  }
  return {
    props: { path: "/api/auth/login" },
  };
};
