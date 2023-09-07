import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import React from "react";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";
import { ProductRead } from "../../type/productType";
import Item from "./Item";

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
              <Item
                item={item}
                items={items}
                discountPercentage={discountPercentage}
                setItems={setItems}
                key={"item_" + item.id}
              />
            );
          } else {
            return <React.Fragment key={`empty_${index}`} />;
          }
        })
      )}
    </>
  );
}
