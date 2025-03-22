import Cookies from "js-cookie";

export const setTokens = (accessToken: string) => {
  Cookies.set("accessToken", accessToken);
};

export const getAccessToken = () => Cookies.get("accessToken");

export const logout = () => {
  Cookies.remove("accessToken");
};
