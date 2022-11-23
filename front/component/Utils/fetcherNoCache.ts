import axios from "axios";

const fetcherNoCache = async (url: string) => {
  return await (
    await axios.get(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
  ).data;
};

export default fetcherNoCache;
