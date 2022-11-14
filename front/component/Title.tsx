import Head from "next/head";

export default function Title({ title }) {
  return (
    <Head>
      <title>{`${title} | ft_transcendence`}</title>
    </Head>
  );
}
