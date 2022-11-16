import axios from "axios";

interface cookieType {
  accessToken?: string;
  refreshToken?: string;
}

export default function tokenManager(cookie: cookieType) {
  const accessToken = cookie["accessToken"];
  const refreshToken = cookie["refreshToken"];
  if (accessToken) {
    axios.defaults.headers["accessToken"] = accessToken;
  } else if (!accessToken && refreshToken) {
    axios.defaults.headers["refreshToken"] = refreshToken;
  }
}
