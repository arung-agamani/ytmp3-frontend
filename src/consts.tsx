export const BASE_URL =
  process.env.REACT_APP_SERVER_TARGET === "remote"
    ? "https://ytdl.howlingmoon.dev"
    : "http://localhost:5500";
