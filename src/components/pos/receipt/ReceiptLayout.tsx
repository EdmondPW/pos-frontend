import { useEffect, useState, forwardRef, Ref } from "react";
import { SalesTransactionWrite } from "../../type/salesTransactionType";
import { ItemTransactionWriteWithItemData } from "../../type/itemTransactionType";
import { User } from "../../type/userType";
import { formatingValue } from "../PosDashboard";

export interface ReceiptLayoutProps {
  items: ItemTransactionWriteWithItemData[];
  transaction: SalesTransactionWrite;
  totalPrice: number;
  addDiscount: number;
  discountPercentage: number;
  showCheckout: boolean;
  setRoundDown: React.Dispatch<React.SetStateAction<number>>;
  cash: number;
  debit: number;
  credit: number;
  transfer: number;
  change: number;
}

const ReceiptLayout = forwardRef(
  (
    {
      items,
      transaction,
      totalPrice,
      addDiscount,
      discountPercentage,
      showCheckout,
      cash,
      debit,
      credit,
      transfer,
      change,
      setRoundDown,
    }: ReceiptLayoutProps,
    ref: Ref<HTMLDivElement>
  ) => {
    // const [fomatedTotalPrice, setFormatedTotalPrice] = useState("");
    const [fomatedTotalPriceRoundDown, setFormatedTotalPriceRoundDown] =
      useState("");
    const [totalPriceBeforeDiscount, setTotalPriceBeforeDiscount] =
      useState("");
    const [fomatedTotalDiscountPrice, setFormatedTotalDiscountPrice] =
      useState("");
    const [customerTypeString, setCustomerTypeString] = useState("");
    const [roundDown, setroundDown] = useState("");

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [time, setTime] = useState("");

    const [formatedCash, setFormatedCash] = useState("");
    const [formatedCredit, setFormatedCredit] = useState("");
    const [formatedDebit, setFormatedDebit] = useState("");
    const [formatedTransfer, setFormatedTransfer] = useState("");
    const [formatedChange, setFormatedChange] = useState("");

    const userData = localStorage.getItem("userData") as string;
    const user: User = JSON.parse(userData);

    const roundDownToNearest500 = (number: number) => {
      const lastTwoDigits = number % 1000;

      if (lastTwoDigits === 500) {
        return number;
      }
      const roundedValue = Math.floor(number / 500) * 500;
      return roundedValue;
    };

    const calulatingTotalDiscount = () => {
      let calculateDiscount = 0;
      let calculatedPriceBeforeDiscount = 0;
      items.map((item) => {
        calculateDiscount += item.discount;
        calculatedPriceBeforeDiscount += item.product_price * item.quantity;
      });
      calculateDiscount += addDiscount;
      const fullFormatedPriceBeforeDiscount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
        .format(calculatedPriceBeforeDiscount)
        .replace("Rp", "")
        .trim();
      setTotalPriceBeforeDiscount(fullFormatedPriceBeforeDiscount);

      const fullFormatedDiscount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
        .format(calculateDiscount)
        .replace("Rp", "")
        .trim();
      setFormatedTotalDiscountPrice(fullFormatedDiscount);
    };

    useEffect(() => {
      const _roundDown = roundDownToNearest500(totalPrice - addDiscount);
      const formatedRoudnDown = formatingValue(
        totalPrice - addDiscount - _roundDown
      );

      setroundDown(formatedRoudnDown);
      const _formatedTotalPriceRoudnDown = formatingValue(_roundDown);

      setFormatedTotalPriceRoundDown(_formatedTotalPriceRoudnDown);
      setRoundDown(totalPrice - addDiscount - _roundDown);

      const _formatedCash = formatingValue(cash);
      const _formatedCredit = formatingValue(credit);
      const _formatedDebit = formatingValue(debit);
      const _formatedTransfer = formatingValue(transfer);
      const _formatedChange = formatingValue(change);

      setFormatedCash(_formatedCash);
      setFormatedCredit(_formatedCredit);
      setFormatedDebit(_formatedDebit);
      setFormatedTransfer(_formatedTransfer);
      setFormatedChange(_formatedChange);

      const currentDate = new Date();

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      setTime(
        hours.toString() + ":" + minutes.toString() + ":" + seconds.toString()
      );
      calulatingTotalDiscount();
    }, [
      addDiscount,
      discountPercentage,
      showCheckout,
      cash,
      credit,
      debit,
      transfer,
      items,
      change,
    ]);

    useEffect(() => {
      const _roundDown = roundDownToNearest500(totalPrice - addDiscount);
      const formatedRoudnDown = formatingValue(
        totalPrice - addDiscount - _roundDown
      );

      setroundDown(formatedRoudnDown);
      const _formatedTotalPriceRoudnDown = formatingValue(_roundDown);

      setFormatedTotalPriceRoundDown(_formatedTotalPriceRoudnDown);
      setRoundDown(totalPrice - addDiscount - _roundDown);

      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      setDay(currentDay.toString());
      setMonth(currentMonth.toString());
      setYear(currentYear.toString());

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      setTime(
        hours.toString() + ":" + minutes.toString() + ":" + seconds.toString()
      );

      calulatingTotalDiscount();
      const getCustomerType = localStorage.getItem("customerType") as string;
      if (
        getCustomerType == "TKOA" ||
        getCustomerType == "TKOB" ||
        getCustomerType == "TKOC" ||
        getCustomerType == "TKOD"
      ) {
        setCustomerTypeString("Toko");
      }
      if (getCustomerType == "GJK") {
        setCustomerTypeString("Gojek");
      }
      if (getCustomerType == "GRB") {
        setCustomerTypeString("Grab");
      }
      if (getCustomerType == "SHP") {
        setCustomerTypeString("Shopee");
      }
    }, []);

    return (
      <>
        <div
          ref={ref}
          className="w-[288px]  flex flex-col items-center p-2 font-saxmono"
        >
          <div className="flex w-full items-center">
            <div className="flex flex-col items-center w-full mx-auto">
              <h1 className="text-2xl font-bold font-times">PIA SARI MURNI</h1>
              <div className="flex flex-col items-center text-xs">
                <h1>Jl. Kembang Jepun No. 34, Surabaya</h1>
                <h1>031-99096309 | 0852-0888-1940</h1>
              </div>
            </div>
          </div>
          <h1>-------------------------------</h1>
          <div className="flex flex-row w-full">
            <p className="mx-auto">{customerTypeString}</p>
            <p className="mx-auto">
              {day}/{month}/{year}
            </p>
            <p className="mx-auto">{transaction.sales_transaction_number}</p>
          </div>
          <h1>-------------------------------</h1>
          {items.map((item, index) => {
            let formatedPrice = "";
            if (item.isBox) {
              formatedPrice = formatingValue(item.product_price * 4);
            } else {
              formatedPrice = formatingValue(item.product_price);
            }

            const fullFormatedPrice = formatingValue(
              item.product_price * item.quantity
            );

            //
            return (
              <div className="flex w-full text-sm" key={"checkout_" + index}>
                <div className="flex flex-col w-full">
                  <p>{item.product_name}</p>
                  <div className="w-full flex flex-row">
                    <div className="flex flex-row w-3/4">
                      <div className="mr-auto">
                        {item.isBox == true ? (
                          <p>{item.quantity / 4} box</p>
                        ) : (
                          <p>{item.quantity} pcs</p>
                        )}
                      </div>

                      <p className="mx-auto">X {formatedPrice}</p>
                    </div>
                    <div className="flex place-content-end w-1/4">
                      <p>{fullFormatedPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <h1>-------------------------------</h1>
          <div className="flex w-full">
            <p>TOTAL GROSS: </p>
            <p className="ml-auto">{totalPriceBeforeDiscount}</p>
          </div>
          <div className="flex w-full">
            <p>Diskon: </p>
            <p className="ml-auto">({fomatedTotalDiscountPrice})</p>
          </div>
          <div className="flex w-full">
            <p>Pembulatan: </p>
            <p className="ml-auto">({roundDown})</p>
          </div>
          <h1>-------------------------------</h1>
          <div className="flex place-content-end w-full">
            <p>TOTAL NETT: </p>
            <p className="ml-auto">{fomatedTotalPriceRoundDown}</p>
          </div>
          <h1>-------------------------------</h1>
          {transaction.customer_type_id == 3 ||
          transaction.customer_type_id == 5 ||
          transaction.customer_type_id == 6 ||
          transaction.customer_type_id == 9 ? (
            <div className="w-full flex place-content-end">
              <div className="flex flex-col w-2/3">
                <div className="flex flex-row w-full">
                  <p className="mr-auto">Tunai</p>
                  <p>{formatedCash}</p>
                </div>
                <div className="flex flex-row">
                  <p className="mr-auto">Debit</p>
                  <p>{formatedDebit}</p>
                </div>
                <div className="flex flex-row">
                  <p className="mr-auto">KK</p>
                  <p>{formatedCredit}</p>
                </div>
                <div className="flex flex-row">
                  <p className="mr-auto">Transfer</p>
                  <p>{formatedTransfer}</p>
                </div>
                <div className="flex flex-row">
                  <p className="mr-auto">Kembalian</p>
                  <p>{formatedChange}</p>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="mt-10 flex flex-row w-full">
            <p className="mx-auto">Kasir: {user.name}</p>
            <p className="mx-auto">{time}</p>
          </div>
          <br />
          <br />
          <br />
        </div>
      </>
    );
  }
);

export default ReceiptLayout;
