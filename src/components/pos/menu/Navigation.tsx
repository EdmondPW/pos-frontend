import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { User } from "../../type/userType";
import { SalesTransactionRead } from "../../type/salesTransactionType";

export default function Navigation({
  getAllTransactionThisShif,
  showTransactionList,
  setShowTransactionList,
  printShiftWhenLogout,
}: {
  getAllTransactionThisShif: () => Promise<SalesTransactionRead[]>;
  showTransactionList: boolean;
  setShowTransactionList: React.Dispatch<React.SetStateAction<boolean>>;
  printShiftWhenLogout: () => void;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: 0,
    name: "none",
    user_code: "",
    role: "",
  });

  useEffect(() => {
    const dataUser = localStorage.getItem("userData") as string;
    if (dataUser) {
      const User = JSON.parse(dataUser);
      setUser(User);
    }
  }, []);

  // const baseURL = "https://pos-backend.piasarimurni.site/api";
  const baseURL = "https://127.0.0.1:4000/api";

  const handleLogout = async () => {
    printShiftWhenLogout();

    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("productTypeFetch");
    localStorage.removeItem("customerType");
    localStorage.removeItem("customerTypeId");
    localStorage.removeItem("customerDiscount");
    await axios
      .post(`${baseURL}/user/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="w-full flex justify-center pb-2">
        <button
          type="button"
          className=" bg-blue-500 w-full h-20 rounded-md text-white shadow-sm"
          onClick={() => {
            setShowTransactionList(!showTransactionList);
          }}
        >
          Daftar transaksi
        </button>
      </div>
      <div className="w-full flex justify-center pb-2">
        <button
          type="button"
          className=" bg-green-500 w-full h-20 rounded-md text-white shadow-sm"
          onClick={() => {
            printShiftWhenLogout();
          }}
        >
          Print transaksi Shift
        </button>
      </div>

      <div className="w-full flex justify-center">
        <h1 className="text-xl">Kasir:</h1>
      </div>
      <div className="w-full flex justify-center">
        <h1>{user.name}</h1>
      </div>
      <div className="mt-auto">
        <button
          type="button"
          className=" bg-red-500 w-full h-20 rounded-md text-white shadow-sm"
          onClick={() => {
            getAllTransactionThisShif();
            handleLogout();
          }}
        >
          LOGOUT
        </button>
      </div>
    </>
  );
}
