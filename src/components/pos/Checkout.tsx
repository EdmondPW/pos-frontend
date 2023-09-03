import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { Payment, formatingValue } from "./PosDashboard";
import ReceiptLayout from "./receipt/ReceiptLayout";
import { SalesTransactionWrite } from "../type/salesTransactionType";
import { ItemTransactionWriteWithItemData } from "../type/itemTransactionType";

interface CheckoutProps {
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setPayment: React.Dispatch<React.SetStateAction<Payment>>;
  totalPrice: number;
  item: ItemTransactionWriteWithItemData[];
  transaction: SalesTransactionWrite;
  showCheckout: boolean;
  discountPercentage: number;
}

export default function Checkout({
  showCheckout,
  setShowCheckout,
  setPayment,
  setAddTransaction,
  totalPrice,
  item,
  transaction,
  discountPercentage,
}: CheckoutProps) {
  const [cash, setCash] = useState(0);
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const [ojol, setOjol] = useState(0);
  const [addDiscount, setAddDiscount] = useState(0);
  const [roundDown, setRoundDown] = useState(0);
  const [change, setChange] = useState(0);
  const [formatedTotalPrice, setFormatedTotalPrice] = useState("");
  const [formatedChange, setFormatedChange] = useState("");
  const [textChange, setTextChange] = useState("");

  console.log(transaction);

  const handlePayment = () => {
    if (
      cash + debit + credit + transfer + ojol >=
      totalPrice - addDiscount - roundDown
    ) {
      setAddTransaction(true);
      setPayment({
        cash: cash,
        debit: debit,
        credit: credit,
        transfer: transfer,
        ojol: ojol,
        addedDiscount: addDiscount,
        roundDown: roundDown,
      });
      handlePrintReceipt();
    } else {
      console.log("HandlePayment failed");
    }
  };

  useEffect(() => {
    const change =
      cash +
      debit +
      credit +
      ojol +
      transfer -
      totalPrice +
      addDiscount +
      roundDown;
    console.log("this is change:");
    console.log(change);
    if (change >= 0) {
      const formated = formatingValue(change);
      setTextChange("Kembalian");
      setChange(change);
      setFormatedChange(formated);
    } else {
      const formated = formatingValue(change * -1);
      setTextChange("Pembayaran kurang: " + formated);
      setFormatedChange("0");
    }
  }, [
    cash,
    debit,
    transfer,
    credit,
    ojol,
    addDiscount,
    discountPercentage,
    roundDown,
  ]);

  useEffect(() => {
    console.log("melihat grand total:");
    console.log(totalPrice);
    console.log(addDiscount);
    console.log(roundDown);
    const _formatedTotalPice = formatingValue(
      totalPrice - addDiscount - roundDown
    );
    setFormatedTotalPrice(_formatedTotalPice);
  }, [
    totalPrice,
    addDiscount,
    discountPercentage,
    roundDown,
    cash,
    debit,
    credit,
    roundDown,
    ojol,
  ]);

  const componentRef = useRef(null);
  const handlePrintReceipt = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleAddDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setAddDiscount(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setAddDiscount(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setAddDiscount(0);
      }
    }
  };

  const clearAllCheckoutInput = () => {
    setCash(0);
    setDebit(0);
    setCredit(0);
    setTransfer(0);
    setAddDiscount(0);
    setOjol(0);
  };

  const handleCash = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setCash(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setCash(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setCash(0);
      }
    }
  };
  const handleDebit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setDebit(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setDebit(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setDebit(0);
      }
    }
  };

  const handleCredit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setCredit(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setCredit(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setCredit(0);
      }
    }
  };

  const handleTransfer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setTransfer(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setTransfer(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setTransfer(0);
      }
    }
  };

  const handleOjol = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check if newValue is null or undefined, and update the state accordingly
    if (newValue === null || newValue === undefined) {
      setOjol(0); // Set count to 0 if value is null or undefined
    } else {
      if (newValue.trim() !== "") {
        setOjol(parseInt(newValue)); // Convert newValue to a number and update the count
      } else {
        setOjol(0);
      }
    }
  };

  return (
    <>
      <div
        className={
          showCheckout ? "bg-slate-400 w-screen h-screen p-4 z-10" : "hidden"
        }
      >
        <div className="bg-white rounded-md shadow-xl w-full h-full flex p-5 gap-2">
          <div className=" w-5/12 bg-slate-300 flex justify-center rounded-lg h-full overflow-hidden">
            <div className=" overflow-y-auto bg-white no-scrollbar">
              <ReceiptLayout
                items={item}
                transaction={transaction}
                totalPrice={totalPrice}
                addDiscount={addDiscount}
                discountPercentage={discountPercentage}
                showCheckout={showCheckout}
                setRoundDown={setRoundDown}
                cash={cash}
                debit={debit}
                credit={credit}
                transfer={transfer}
                change={change}
                ref={componentRef}
              />
            </div>
          </div>
          <div className=" w-7/12 bg-slate-300 rounded-lg h-full p-2 flex flex-col items-center">
            <div className="h-2/4 w-full">
              <div className="flex flex-col place-content-center px-16">
                <label htmlFor="kembalian" className="text-2xl font-bold">
                  {textChange}
                </label>
                <input
                  type="text"
                  name="kembalian"
                  readOnly
                  value={formatedChange}
                  className="bg-slate-200 p-1 border-2 border-black rounded-md h-16 text-3xl"
                />
              </div>
              <div className="flex gap-2 py-3 justify-center mt-7">
                <label htmlFor="addDicount" className="text-xl font-semibold">
                  Diskon tambahan :
                </label>
                <input
                  type="text"
                  name="addDicount"
                  value={addDiscount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleAddDiscount(event);
                  }}
                  className="bg-slate-200 p-1 border-2 border-black rounded-md"
                />
              </div>
              <div className="flex gap-2 py-3 justify-center mt-2">
                <label htmlFor="" className="text-xl font-semibold ">
                  GRAND TOTAL :
                </label>
                <p className="text-xl font-semibold ">{formatedTotalPrice}</p>
              </div>
            </div>
            <div className="h-4/6 w-full flex flex-col">
              <h1 className="text-3xl font-bold ml-32">PEMBAYARAN:</h1>
              {transaction.customer_type_id == 1 ||
              transaction.customer_type_id == 2 ||
              transaction.customer_type_id == 4 ? (
                <>
                  <div className="flex gap-2 py-3 justify-center mt-3">
                    <div className="w-20">
                      <label htmlFor="ojol" className="text-xl font-semibold">
                        Pembayaran Ojek Online
                      </label>
                    </div>
                    :
                    <input
                      type="text"
                      name="ojol"
                      id="ojol"
                      value={ojol}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleOjol(event);
                      }}
                      className="bg-slate-200 w-60 p-1 border-2 border-black rounded-md"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2 py-3 justify-center mt-3">
                    <div className="w-20">
                      <label htmlFor="tunai" className="text-xl font-semibold">
                        Tunai
                      </label>
                    </div>
                    :
                    <input
                      type="text"
                      name="tunai"
                      id="tunai"
                      value={cash}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleCash(event);
                      }}
                      className="bg-slate-200 w-60 p-1 border-2 border-black rounded-md"
                    />
                  </div>
                  <div className="flex gap-2 py-3 justify-center">
                    <div className="w-20">
                      <label htmlFor="debit" className="text-xl font-semibold">
                        Debit
                      </label>
                    </div>
                    :
                    <input
                      type="text"
                      id="debit"
                      value={debit}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleDebit(event);
                      }}
                      className="bg-slate-200 w-60 p-1 border-2 border-black rounded-md"
                    />
                  </div>
                  <div className="flex gap-2 py-3 justify-center">
                    <div className="w-20">
                      <label htmlFor="credit" className="text-xl font-semibold">
                        Credit
                      </label>
                    </div>
                    :
                    <input
                      type="text"
                      id="credit"
                      value={credit}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleCredit(event);
                      }}
                      className="bg-slate-200 w-60 p-1 border-2 border-black rounded-md"
                    />
                  </div>
                  <div className="flex gap-2 py-3 justify-center">
                    <div className="w-20">
                      <label
                        htmlFor="transfer"
                        className="text-xl font-semibold"
                      >
                        Transfer
                      </label>
                    </div>
                    :
                    <input
                      type="text"
                      id="transfer"
                      value={transfer}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleTransfer(event);
                      }}
                      className="bg-slate-200 w-60 p-1 border-2 border-black rounded-md"
                    />
                  </div>
                </>
              )}

              <div className="my-auto">
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckout(false);
                    }}
                    className="p-3 bg-red-500 w-1/3 mx-auto rounded-md shadow-lg font-semibold"
                  >
                    BATAL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // componentRef.current
                      handlePayment();
                      clearAllCheckoutInput();
                    }}
                    className="p-3 bg-green-500 w-1/3 mx-auto rounded-md shadow-lg font-semibold"
                  >
                    CETAK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
