import { ReactNode, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
import axios from "axios";

import { User } from "../type/userType";

export interface TokenData {
  exp: number;
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = localStorage.getItem("accessToken") as string;
  const [checkRefresh, setCheckRefresh] = useState(false);
  // const [completeRefresh, setCompleteRefresh] = useState(false);

  // const productionUrl =
  //   "http://pos-backend.piasarimurni.site/api/user/refresh-token";
  const baseURL = "https://pos-backend.piasarimurni.site/api";

  useEffect(() => {
    if (checkRefresh) {
      let result;
      const refresh = async () => {
        result = await refreshAccessToken();
      };
      refresh();
      if (result == true) {
        setCheckRefresh(false);
      }
    }
  }, [checkRefresh]);

  const isTokenValid = (): boolean => {
    if (accessToken != "") {
      try {
        const decodedToken = jwtDecode<TokenData>(accessToken);
        const currentTime = Date.now() / 1000; // Convert to seconds

        return decodedToken.exp > currentTime;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const refreshAccessToken = async () => {
    console.log("Start Refresh access token");
    const user = localStorage.getItem("userData");
    if (user) {
      const parsedUser: User = JSON.parse(user);
      try {
        const response = await axios.post(
          `${`${baseURL}`}/user/refresh-token/${parsedUser.id}`,
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.data.access_token as string;
        localStorage.setItem("accessToken", newAccessToken);
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    }
  };

  if (isTokenValid()) {
    console.log("Protected route: authenticated");
    return children;
  } else {
    console.log("Protected route: token expired!");
    localStorage.clear();
    return <Navigate to={"/login"} />;
  }
};

export default ProtectedRoute;
