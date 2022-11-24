import axios from "axios";

const fetcher = async (url: string) => {
  try {
    return await (
      await axios.get(url)
    ).data;
  } catch (e) {
    throw e;
  }
};

export default fetcher;
