import { useEffect, useRef, useState } from "react";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";
import { formatingValue } from "../PosDashboard";

type formatedCurrency = {
  price: string;
  discount: string;
  nonDiscountedPrice: string;
  discountedPrice: string;
};

export default function Row({
  item,
  items,
  setItems,
  discountPercentage,
}: {
  item: ItemTransactionWriteWithItemData;
  items: ItemTransactionWriteWithItemData[];
  setItems: React.Dispatch<
    React.SetStateAction<ItemTransactionWriteWithItemData[]>
  >;
  discountPercentage: number;
}) {
  const [box, setBox] = useState(false);
  const [defaultBox, setDefaultBox] = useState(true);
  const [formatedPrice, setFormatedPrice] = useState<formatedCurrency>({
    price: "",
    discount: "",
    nonDiscountedPrice: "",
    discountedPrice: "",
  });

  const [alreadyAddPrice, setAlreadyAddPrice] = useState(false);
  const originaPrice = useRef(item.product_price);

  useEffect(() => {
    if (discountPercentage == -1) {
      setAlreadyAddPrice(false);
    }
  }, [discountPercentage]);

  const handleSetBox = () => {
    const currentBox = !box;
    setBox(!box);
    setDefaultBox(false);
    let getIndex = 0;
    let tempItems: ItemTransactionWriteWithItemData[] = [];
    items.forEach((_item, index) => {
      if (_item.product_id == item.product_id) {
        getIndex = index;
      }
    });
    tempItems = items;
    tempItems[getIndex].isBox = !items[getIndex].isBox;
    if (currentBox == true) {
      tempItems[getIndex].quantity = items[getIndex].quantity * 4;
    } else if (defaultBox == false && currentBox == false) {
      tempItems[getIndex].quantity = items[getIndex].quantity / 4;
    }
    setItems([...tempItems]);
  };

  const increaseQuantity = () => {
    const find = items.findIndex(
      (thisItem) => thisItem.product_id === item.product_id
    );
    const updateItems = [...items];
    if (box) {
      updateItems[find].quantity += 4;
    } else {
      updateItems[find].quantity += 1;
    }
    console.log("increase button");
    console.log("already add price: " + alreadyAddPrice);
    console.log("item disount in row: " + discountPercentage + "%");
    console.log("original price: " + item.product_price);
    let tempPrice = item.product_price;
    if (discountPercentage != 0 && alreadyAddPrice == true) {
      if (updateItems[find].product_type_code == "PIA") {
        setAlreadyAddPrice(false);
        updateItems[find].product_price = originaPrice.current;
      }
    } else if (discountPercentage == 0 && alreadyAddPrice == false) {
      if (updateItems[find].product_type_code == "PIA") {
        setAlreadyAddPrice(true);
        updateItems[find].product_price = tempPrice + 1500;
      }
    }

    if (
      updateItems[find].product_type_code == "TCPKC" ||
      updateItems[find].product_type_code == "TCPKP" ||
      updateItems[find].product_type_code == "TCPSS"
    ) {
      updateItems[find].discount =
        (updateItems[find].quantity *
          updateItems[find].product_price *
          discountPercentage) /
        100;
    }
    setItems([...updateItems]);
  };

  const decreseQuantity = () => {
    const find = items.findIndex(
      (thisItem) => thisItem.product_id === item.product_id
    );
    const updateItems = [...items];
    if (updateItems[find].quantity >= 1 && box == false) {
      updateItems[find].quantity -= 1;
      if (
        updateItems[find].product_type_code == "TCPKC" ||
        updateItems[find].product_type_code == "TCPKP" ||
        updateItems[find].product_type_code == "TCPSS"
      ) {
        updateItems[find].discount =
          (updateItems[find].quantity *
            updateItems[find].product_price *
            discountPercentage) /
          100;
      }
      setItems([...updateItems]);
    }
    console.log("decrease button");
    console.log("already add price: " + alreadyAddPrice);
    console.log("item disount in row: " + discountPercentage + "%");
    console.log("original price: " + item.product_price);
    let tempPrice = item.product_price;
    if (discountPercentage != 0 && alreadyAddPrice == true) {
      if (updateItems[find].product_type_code == "PIA") {
        setAlreadyAddPrice(false);
        /// jika bukan ojol dan sudah tambah harga, kembali ke harga asal

        updateItems[find].product_price = originaPrice.current;
      }
    } else if (discountPercentage == 0 && alreadyAddPrice == false) {
      if (updateItems[find].product_type_code == "PIA") {
        /// jika ojol dan belum tambah harga, tambah harga +1500
        setAlreadyAddPrice(true);
        updateItems[find].product_price = tempPrice + 1500;
      }
    }

    if (updateItems[find].quantity >= 4 && box == true) {
      updateItems[find].quantity -= 4;
      if (
        updateItems[find].product_type_code == "TCPKC" ||
        updateItems[find].product_type_code == "TCPKP" ||
        updateItems[find].product_type_code == "TCPSS"
      ) {
        updateItems[find].discount =
          (updateItems[find].quantity *
            updateItems[find].product_price *
            discountPercentage) /
          100;
      }
      setItems([...updateItems]);
    }
    if (updateItems[find].quantity == 0) {
      updateItems.splice(find, 1);
      setItems([...updateItems]);
    }
  };

  useEffect(() => {
    let tempPrice = item.product_price;
    if (discountPercentage != 0 && alreadyAddPrice == true) {
      if (item.product_type_code == "PIA") {
        setAlreadyAddPrice(false);
        /// jika bukan ojol dan sudah tambah harga, kembali ke harga asal

        item.product_price = originaPrice.current;
      }
    } else if (discountPercentage == 0 && alreadyAddPrice == false) {
      if (item.product_type_code == "PIA") {
        /// jika ojol dan belum tambah harga, tambah harga +1500
        setAlreadyAddPrice(true);
        item.product_price = tempPrice + 1500;
      }
    }
  }, [discountPercentage]);

  useEffect(() => {
    let _formatedPrice;

    if (box) {
      _formatedPrice = formatingValue(item.product_price * 4);
    } else {
      _formatedPrice = formatingValue(item.product_price);
    }

    const _formatedDiscountPrice = formatingValue(
      item.product_price * item.quantity -
        item.product_price * ((item.quantity * discountPercentage) / 100)
    );

    const _formatedNonDiscountPrice = formatingValue(
      item.product_price * item.quantity
    );

    const _formatedDiscount = formatingValue(
      (item.product_price * item.quantity * discountPercentage) / 100
    );

    console.log("item code:" + item.product_type_code);

    setFormatedPrice({
      price: _formatedPrice,
      discount: _formatedDiscount,
      nonDiscountedPrice: _formatedNonDiscountPrice,
      discountedPrice: _formatedDiscountPrice,
    });
  }, [items, item, discountPercentage, box, alreadyAddPrice]);

  useEffect(() => {
    console.log("items berubah");
  }, [items]);

  return (
    <tr className="bg-black border-b bg-opacity-5 border-white">
      <th className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
        {item.product_code}
      </th>
      <td className="px-5 py-4 text-gray-900 font-semibold">
        {item.product_name}
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-row ">
          <button
            type="button"
            className="text-center font-bold text-xl"
            onClick={decreseQuantity}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 hover:fill-white hover:border focus:border-white rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <input
            type="number"
            name="quantity"
            id="quantity"
            value={box ? item.quantity / 4 : item.quantity}
            readOnly
            className="w-11 p-1 text-center bg-transparent text-sm text-gray-900 font-medium focus:outline-none"
          />

          <button
            type="button"
            className="text-center font-bold text-xl "
            onClick={increaseQuantity}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 hover:fill-white hover:border focus:border-white rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </td>
      <td className="px-5 py-4 flex flex-col items-center">
        {item.product_type_code == "TCPKC" ||
        item.product_type_code == "TCPKP" ? (
          <>
            <label className="relative inline-flex items-center cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={box}
                className="sr-only peer"
                readOnly
              />
              <div
                onClick={handleSetBox}
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
              ></div>
            </label>
            {box ? (
              <>
                <p className="font-bold text-gray-900">box</p>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-900">pcs</p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="font-bold text-gray-900">pcs</p>
          </>
        )}
      </td>

      <td className="px-5 py-4 text-gray-900 font-semibold">
        {formatedPrice.price}
      </td>
      <td className="px-5 py-4 text-gray-900 font-semibold">
        {item.product_type_code == "TCPKC" ||
        item.product_type_code == "TCPKP" ||
        item.product_type_code == "TCPSS"
          ? formatedPrice.discount
          : 0}
      </td>
      <td className="px-5 py-4 text-gray-900 font-semibold">
        {item.product_type_code == "TCPKC" ||
        item.product_type_code == "TCPKP" ||
        item.product_type_code == "TCPSS"
          ? formatedPrice.discountedPrice
          : formatedPrice.nonDiscountedPrice}
      </td>
    </tr>
  );
}
