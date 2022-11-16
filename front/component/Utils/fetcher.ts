import axios from "axios";

const fetcher = async (url: string) => {
  return await (
    await axios.get(url)
  ).data;
};

export default fetcher;
