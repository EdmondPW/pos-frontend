import { useEffect, useState } from "react";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";

export default function TotalPrice({
  totalPrice,
  items,
}: {
  totalPrice: number;
  items: ItemTransactionWriteWithItemData[];
}) {
  const [formatedTotalPrice, setFormatedTotalPrice] = useState("");

  function customRoundDownTo500(value: number) {
    const lastTwoDigits = value % 1000;

    if (lastTwoDigits === 500) {
      return value;
    }

    const roundedValue = Math.floor(value / 500) * 500;
    return roundedValue;
  }

  useEffect(() => {
    const roundedTotalPrice = customRoundDownTo500(totalPrice);
    const _formatedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(roundedTotalPrice)
      .replace("Rp", "")
      .trim();
    setFormatedTotalPrice(_formatedPrice);
  }, [totalPrice, items]);

  return (
    <>
      <p className="font-bold text-5xl">TOTAL</p>
      <br />
      <div className="flex flex-row">
        <p className="font-bold text-5xl">Rp</p>
        <p className="font-bold text-5xl w-full flex place-content-end">
          {formatedTotalPrice}
        </p>
      </div>
    </>
  );
}
