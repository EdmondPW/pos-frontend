import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import React from "react";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";
import { ProductRead } from "../../type/productType";

export default function ItemButton({
  id,
  items,
  setItems,
  discountPercentage,
}: {
  id: number;
  items: ItemTransactionWriteWithItemData[];
  setItems: React.Dispatch<
    React.SetStateAction<ItemTransactionWriteWithItemData[]>
  >;
  discountPercentage: number;
}) {
  const accessToken = localStorage.getItem("accessToken");
  // const getDiscount = localStorage.getItem("customerDiscount");
  // if (getDiscount) {
  //   discount = parseInt(getDiscount);
  // }

  const [skip, setSkip] = useState(false);

  const baseURL = "http://127.0.0.1:4000/api";
  // const baseURL = "https://pos-backend.piasarimurni.site/api";

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("start fetch product");
      const { data } = await axios.get(`${baseURL}/product`, {
        headers: {
          Authorization: accessToken,
        },
      });
      return data as ProductRead[];
    },
    enabled: skip == false,
  });

  useEffect(() => {
    if (isLoading == false && skip == false) {
      console.log("fetch product once");
      setSkip(true);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <p key={999}>Menu is loading</p>
      ) : (
        data?.map((item, index) => {
          if (item.product_type.id == id) {
            return (
              <React.Fragment key={item.id}>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const find = items.findIndex(
                        (thisItem) => thisItem.product_id === item.id
                      );
                      if (find !== -1) {
                        const updateItems = [...items];

                        if (
                          item.product_type.product_type_code == "TCPKC" ||
                          item.product_type.product_type_code == "TCPKP" ||
                          item.product_type.product_type_code == "TCPSS"
                        ) {
                          if (updateItems[find].isBox == true) {
                            updateItems[find].quantity += 4;
                          } else {
                            updateItems[find].quantity += 1;
                          }

                          updateItems[find].discount =
                            (updateItems[find].product_price *
                              updateItems[find].quantity *
                              discountPercentage) /
                            100;
                        } else {
                          updateItems[find].quantity += 1;
                        }
                        setItems([...updateItems]);
                      } else {
                        let initDiscount = 0;
                        if (
                          item.product_type.product_type_code == "TCPKC" ||
                          item.product_type.product_type_code == "TCPKP" ||
                          item.product_type.product_type_code == "TCPSS"
                        ) {
                          initDiscount =
                            (item.price * discountPercentage) / 100;
                        }

                        setItems([
                          ...items,
                          {
                            id: 0,
                            product_id: item.id,
                            quantity: 1,
                            sales_transaction_id: 0,
                            product_code: item.product_code,
                            product_name: item.product_name,
                            product_price: item.price,
                            product_type_code:
                              item.product_type.product_type_code,
                            discount: initDiscount,
                            isBox: false,
                          },
                        ]);
                      }
                    }}
                    className="bg-red-400 focus:bg-red-500 w-32 h-14 rounded-lg border-2 border-slate-700 focus:border-red-700 focus:border-4 font-bold text-white"
                  >
                    {item.product_name}
                  </button>
                </div>
              </React.Fragment>
            );
          } else {
            return <React.Fragment key={`empty_${index}`} />;
          }
        })
      )}
    </>
  );
}
