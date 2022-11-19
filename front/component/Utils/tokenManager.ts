import axios from "axios";
import { TokenType } from "../../interfaceType";

export default function tokenManager(cookie: TokenType) {
  const accessToken = cookie["accessToken"];
  const refreshToken = cookie["refreshToken"];
  if (accessToken) {
    axios.defaults.headers["accessToken"] = accessToken;
  } else if (!accessToken && refreshToken) {
    axios.defaults.headers["refreshToken"] = refreshToken;
  }
}
