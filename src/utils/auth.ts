import Cookies from "js-cookie";

export const setTokens = (accesstoken: string) => {
  Cookies.set("accesstoken", accesstoken);
};

export const getAccessToken = () => Cookies.get("accesstoken");

export const logout = () => {
  Cookies.remove("accesstoken");
};
