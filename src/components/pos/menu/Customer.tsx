import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export type CustomerType = {
  id: number;
  customer_type_code: string;
  customer_type_name: string;
};

export default function Customer({
  setDiscountPercenteage,
}: {
  setDiscountPercenteage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [skip, setSkip] = useState(false);
  const accessToken = localStorage.getItem("accessToken") as string;

  //   const productionUrl =
  const baseURL = "https://127.0.0.1:4000/api";
  // const baseURL = "https://pos-backend.piasarimurni.site/api";

  const { data, isLoading } = useQuery({
    queryKey: ["customerType"],
    queryFn: async () => {
      console.log("start fetch customer type");
      const { data } = await axios.get(`${baseURL}/customer-type`, {
        headers: {
          Authorization: accessToken,
        },
      });
      return data as CustomerType[];
    },
    enabled: skip == false,
  });

  useEffect(() => {
    if (isLoading == false && skip == false) {
      console.log("fetch customer once");
      setSkip(true);
    }
  }, []);

  const handleSelectCustomer = (choice: number, discount: number = 0) => {
    let cid: CustomerType | undefined;
    switch (choice) {
      case 0:
        localStorage.setItem("customerType", "TKOA");
        cid = data?.find((customer) => customer.customer_type_code === "TKOA");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 1:
        localStorage.setItem("customerType", "GRB");
        cid = data?.find((customer) => customer.customer_type_code === "GRB");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 2:
        localStorage.setItem("customerType", "GJK");
        cid = data?.find((customer) => customer.customer_type_code === "GJK");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 3:
        localStorage.setItem("customerType", "SHP");
        cid = data?.find((customer) => customer.customer_type_code === "SHP");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 4:
        localStorage.setItem("customerType", "TKOB");
        cid = data?.find((customer) => customer.customer_type_code === "TKOB");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 5:
        localStorage.setItem("customerType", "TKOC");
        cid = data?.find((customer) => customer.customer_type_code === "TKOC");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;

      case 6:
        localStorage.setItem("customerType", "TKOD");
        cid = data?.find((customer) => customer.customer_type_code === "TKOD");
        localStorage.setItem("customerTypeId", cid?.id.toString() || "");
        localStorage.setItem("customerDiscount", discount.toString());
        setDiscountPercenteage(discount);
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col flex-auto w-full h-full gap-1">
        <div className="w-full grow">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(0, 10);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                10%
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(4, 15);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                15%
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(5, 20);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                20%
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(6, 22.5);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                22.5%
              </button>
            </div>
          </div>
        </div>
        <div className="w-full grow">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(2);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-full h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                GOJEK
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(1);
                }}
                className="bg-blue-400 focus:bg-blue-500 w-full h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                GRAB
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  handleSelectCustomer(3);
                }}
                className="bg-blue-400 focus:bg-blue-500  w-full h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
              >
                SHOPEE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
