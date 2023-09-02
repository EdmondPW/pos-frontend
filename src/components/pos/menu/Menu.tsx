import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import ItemButton from "./ItemButton";
import { ProductType } from "../../type/productTypeContext";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";

interface MenuProps {
  items: ItemTransactionWriteWithItemData[];
  setItems: React.Dispatch<
    React.SetStateAction<ItemTransactionWriteWithItemData[]>
  >;
  discountPercentage: number;
}

export default function Menu({
  items,
  setItems,
  discountPercentage,
}: MenuProps) {
  const [skip, setSkip] = useState(false);
  const [typeId, setTypeId] = useState(0);
  const accessToken = localStorage.getItem("accessToken");

  // const baseURL = "https://pos-backend.piasarimurni.site/api";
  const baseURL = "https://127.0.0.1:4000/api";

  const { data, isLoading } = useQuery({
    queryKey: ["productType"],
    queryFn: async () => {
      console.log("start fetch menu");
      const { data } = await axios.get(`${baseURL}/product-type`, {
        headers: {
          Authorization: accessToken,
        },
      });
      localStorage.setItem("productTypeFetch", JSON.stringify(true));
      return data as ProductType[];
    },
    enabled: skip == false,
  });

  useEffect(() => {
    const checkFetch = localStorage.getItem("productTypeFetch");
    if (checkFetch) {
      const parseCheckFetch = JSON.parse(checkFetch);
      if (isLoading == false && skip == false && parseCheckFetch == false) {
        console.log("fetch menu once");
        setSkip(true);
      }
    } else {
      localStorage.setItem("productTypeFetch", JSON.stringify(false));
    }
  }, []);

  return (
    <>
      <div className="w-1/3 h-full">
        <div className="grid grid-rows-5 gap-3 h-full">
          {isLoading ? (
            <p key={999}>Menu is loading</p>
          ) : (
            data?.map((_item) => {
              return (
                <button
                  type="button"
                  key={_item.id}
                  onClick={() => setTypeId(_item.id)}
                  className="bg-green-400 focus:bg-green-500 w-40 h-full rounded-lg border-2 border-slate-700 focus:border-green-700 focus:border-4 font-bold text-white"
                >
                  {_item.product_type_name}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="w-2/3 h-full bg-blue-800 bg-opacity-5 shadow-xl rounded-lg overflow-hidden">
        <div className="max-h-[300px] overflow-auto no-scrollbar">
          <div className="grid grid-rows-5 grid-cols-2 gap-2 pt-1">
            <ItemButton
              id={typeId}
              items={items}
              setItems={setItems}
              discountPercentage={discountPercentage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
