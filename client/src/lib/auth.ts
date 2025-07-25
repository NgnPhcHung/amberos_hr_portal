import axios from "axios";

export const login = async (username: string, password: string) => {
  const response = await axios.post("http://localhost:3001/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const register = async (data: {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
}) => {
  const response = await axios.post(
    "http://localhost:3001/auth/register",
    data,
  );
  return response.data;
};

export const forgotPassword = async (email: string) => {
  await axios.post("http://localhost:3001/auth/forgot-password", { email });
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post("http://localhost:3001/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

export const logout = async () => {
  const accessToken = localStorage.getItem("accessToken");
  await axios.post(
    "http://localhost:3001/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");
