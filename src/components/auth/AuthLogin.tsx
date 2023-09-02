import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../type/userType";

import jwtDecode from "jwt-decode";

interface loginResponse {
  message: string;
  status: boolean;
  accessToken: string;
  refreshToken: string;
}

interface TokenData {
  exp: number;
  iat: number;
  user: User;
}

function AuthLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const clearInput = () => {
    setName("");
    setPassword("");
  };

  const baseURL = "https://127.0.0.1:4000/api";
  // const baseURL = "https://pos-backend.piasarimurni.site/api";

  const handleLogin = async () => {
    try {
      const loginData = { name: name, password: password };
      await axios
        .post(`${baseURL}/user/login`, loginData)
        .then((res) => {
          const data: loginResponse = res.data;
          const decodedToken = jwtDecode<TokenData>(data.accessToken);
          localStorage.setItem("userData", JSON.stringify(decodedToken.user));
          localStorage.setItem("accessToken", data.accessToken);
          navigate("/pos");
        })
        .catch((error) => {
          clearInput();
          const data: loginResponse = error.response.data;
          setErrorMessage(data.message);
          console.log(error.response.data);
        });
    } catch (error) {
      clearInput();
      console.log(error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    handleLogin();
  };

  return (
    <>
      <div className="flex items-center place-content-center w-screen h-screen bg-slate-300">
        <div className="flex items-center place-content-center md:w-2/4 w-3/4 h-2/4 bg-slate-400 rounded-md">
          <form onSubmit={handleSubmit}>
            <h1 className="mb-2 text-4xl font-bold text-white">Login Form</h1>

            <div className="flex items-center place-content-center w-full bg-red-500 bg-opacity-25">
              <p className="text-xl text-red-900">{errorMessage}</p>
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="username" className="mb-1 text-white text-xl">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
                className="p-1 rounded-md"
              />
            </div>
            <div className="flex flex-col  mb-5">
              <label htmlFor="password" className="mb-1 text-white text-xl">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="p-1 rounded-md"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-400 p-1 w-full rounded-md text-white hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AuthLogin;
