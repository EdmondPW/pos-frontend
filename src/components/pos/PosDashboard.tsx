import { useState, useEffect, useRef } from "react";
import ActionTransaction from "./menu/ActionTransaction";
import Customer from "./menu/Customer";
import Menu from "./menu/Menu";
import Row from "./table_component/Row";
import Navigation from "./menu/Navigation";
import TotalPrice from "./menu/TotalPrice";
import { User, UserRead } from "../type/userType";
import Checkout from "./Checkout";
import axios from "axios";
import {
  SalesTransactionReadWithCreateAt,
  SalesTransactionWrite,
} from "../type/salesTransactionType";
import { ItemTransactionWriteWithItemData } from "../type/itemTransactionType";
import TransactionList from "./TransactionList";
import ShiftReport from "./receipt/ShiftReport";
import { useReactToPrint } from "react-to-print";

export type Payment = {
  cash: number;
  debit: number;
  credit: number;
  transfer: number;
  ojol: number;
  addedDiscount: number;
  roundDown: number;
};
export const formatingValue = (value: number): string => {
  const data = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("Rp", "")
    .trim();
  return data;
};

export default function Pos_dashboard() {
  const [initialTransaction, setInitialTransaction] = useState(false);

  const getYear = new Date().getFullYear();
  const getDate = new Date().getDate();
  const [transaction, setTransaction] = useState<SalesTransactionWrite>({
    id: 0,
    sales_transaction_number: "PT" + getDate.toString() + getYear.toString(),
    sales_transaction_status: "null",
    total_price: 0,
    total_discount: 0,
    total_paid_cash: 0,
    total_paid_debit: 0,
    total_paid_credit: 0,
    total_paid_transfer: 0,
    total_paid_ojol: 0,
    total_nett: 0,
    cash_back: 0,
    user_id: 0,
    customer_type_id: 0,
  });

  const [payment, setPayment] = useState<Payment>({
    cash: 0,
    debit: 0,
    credit: 0,
    transfer: 0,
    ojol: 0,
    addedDiscount: 0,
    roundDown: 0,
  });
  const [items, setItems] = useState<ItemTransactionWriteWithItemData[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTransactionList, setShowTransactionList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const accessToken = localStorage.getItem("accessToken") as string;
  const [addTransaction, setAddTransaction] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // const [shiftTransactions, setShifTransactions] = useState<
  //   SalesTransactionRead[]
  // >([]);

  // const baseURL = "https://pos-backend.piasarimurni.site/api";
  const baseURL = "http://127.0.0.1:4000/api";

  const setupTransaction = async () => {
    const user = localStorage.getItem("userData");

    // let totalDiscount = 0;
    const transactionCount = await axios.post(
      `${baseURL}/sales-transaction/count`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    // console.log(`transaction count: ${transactionCount.data}`);
    let currentTransactionNumber = "00" + transactionCount.data.toString();
    if (transactionCount.data >= 10 && transactionCount.data < 100) {
      currentTransactionNumber = "0" + transactionCount.data.toString();
    }

    if (transactionCount.data >= 100) {
      currentTransactionNumber = transactionCount.data.toString();
    }

    const getYear = new Date().getFullYear();
    const getMonth = new Date().getMonth() + 1;
    let currentMonth = "0" + getMonth.toString();
    if (getMonth > 10) {
      currentMonth = getMonth.toString();
    }

    if (user) {
      const userData: User = JSON.parse(user);
      const customerType = localStorage.getItem("customerTypeId") as string;
      if (customerType) {
        setTransaction({
          ...transaction,
          sales_transaction_number:
            "PT" + getYear.toString() + currentMonth + currentTransactionNumber,
          user_id: userData.id,
          customer_type_id: parseInt(customerType),
        });
      }
    }
  };

  const createItemTransaction = async (
    quantity: number,
    product_id: number,
    sales_transaction_id: number
  ) => {
    await axios.post(
      `${baseURL}/item-transaction`,
      {
        quantity: quantity,
        product_id: product_id,
        sales_transaction_id: sales_transaction_id,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    // console.log(createNewItem);
  };

  const finilizedTransaction = async (
    status: string = "DONE",
    updating: boolean = false,
    data: SalesTransactionWrite | null = null
  ) => {
    const customerType = localStorage.getItem("customerTypeId") as string;
    const user = localStorage.getItem("userData") as string;
    const customerTypeId: number = JSON.parse(customerType);
    const userData: User = JSON.parse(user);
    console.log(transaction);
    let transactionData: SalesTransactionWrite = transaction;
    console.log(`updating ${updating}`);
    console.log(`updating status ${updatingStatus}`);
    console.log(`status ${status}`);
    console.log(`add tarnsaction: ${addTransaction}`);
    let totalDiscount = 0;
    if (
      (updatingStatus == false && addTransaction && status != "VOID") ||
      (updating == false && addTransaction && status != "VOID")
    ) {
      console.log("add transaction");
      {
        let currentTransactionNumber = "001";
        await axios
          .post(
            `${baseURL}/sales-transaction/count`,
            {},
            {
              headers: {
                Authorization: accessToken,
              },
            }
          )
          .then((res) => {
            currentTransactionNumber = "00" + res.data.toString();
            if (res.data >= 10 && res.data < 100) {
              currentTransactionNumber = "0" + res.data.toString();
            }

            if (res.data >= 100) {
              currentTransactionNumber = res.data.toString();
            }
          })
          .catch(() => {
            currentTransactionNumber = "001";
          });

        const getYear = new Date().getFullYear();
        const getMonth = new Date().getMonth() + 1;
        let currentMonth = "0" + getMonth.toString();
        if (getMonth > 10) {
          currentMonth = getMonth.toString();
        }

        items.forEach((item) => {
          if (
            item.product_type_code == "TCPKC" ||
            item.product_type_code == "TCPKP" ||
            item.product_type_code == "TCPSS"
          ) {
            totalDiscount += item.discount;
          }
        });

        transactionData.user_id = userData.id;
        transactionData.total_price = totalPrice + totalDiscount;

        transactionData.total_discount =
          totalDiscount + payment.addedDiscount + payment.roundDown;

        transactionData.sales_transaction_number =
          "PT" + getYear.toString() + currentMonth + currentTransactionNumber;
        transactionData.customer_type_id = customerTypeId;
        transactionData.total_paid_cash = payment.cash;
        transactionData.total_paid_debit = payment.debit;
        transactionData.total_paid_transfer = payment.transfer;
        transactionData.total_paid_credit = payment.credit;
        transactionData.sales_transaction_status = status;
        transactionData.total_paid_ojol = payment.ojol;
        transactionData.total_nett =
          transactionData.total_price - transactionData.total_discount;

        transactionData.cash_back =
          payment.cash +
          payment.credit +
          payment.debit +
          payment.ojol +
          payment.transfer -
          transactionData.total_nett;
        setTransaction(transactionData);

        const createNewSalesTransaction = await axios.post(
          `${baseURL}/sales-transaction`,
          {
            sales_transaction_number: transactionData.sales_transaction_number,
            sales_transaction_status: transactionData.sales_transaction_status,
            total_price: transactionData.total_price,
            total_discount: transactionData.total_discount,
            total_paid_cash: transactionData.total_paid_cash,
            total_paid_debit: transactionData.total_paid_debit,
            total_paid_credit: transactionData.total_paid_credit,
            total_paid_transfer: transactionData.total_paid_transfer,
            total_paid_ojol: transactionData.total_paid_ojol,
            total_nett: transactionData.total_nett,
            cash_back: transactionData.cash_back,
            user_id: transactionData.user_id,
            customer_type_id: customerTypeId,
          },
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );

        items.forEach((item) => {
          createItemTransaction(
            item.quantity,
            item.product_id,
            createNewSalesTransaction.data.id
          );
        });
      }

      if (addTransaction) {
        setPayment({
          cash: 0,
          debit: 0,
          credit: 0,
          transfer: 0,
          ojol: 0,
          addedDiscount: 0,
          roundDown: 0,
        });
      }

      setAddTransaction(false);

      setInitialTransaction(true);
      clearTransactionAndItems();
      setShowCheckout(false);
    } else if (
      (updatingStatus == true && addTransaction && status != "VOID") ||
      (updating == true && addTransaction && status != "VOID")
    ) {
      console.log("bayar yang tunda");
      items.forEach((item) => {
        if (
          item.product_type_code == "TCPKC" ||
          item.product_type_code == "TCPKP" ||
          item.product_type_code == "TCPSS"
        ) {
          totalDiscount += item.discount;
        }
      });

      console.log(transaction);

      transactionData.total_discount =
        totalDiscount + payment.addedDiscount + payment.roundDown;

      transactionData.total_price = totalPrice + totalDiscount;

      transactionData.customer_type_id = transaction.customer_type_id;
      transactionData.total_paid_cash = payment.cash;
      transactionData.total_paid_debit = payment.debit;
      transactionData.total_paid_transfer = payment.transfer;
      transactionData.total_paid_credit = payment.credit;
      transactionData.sales_transaction_status = status;
      transactionData.total_paid_ojol = payment.ojol;
      transactionData.total_nett =
        transactionData.total_price - transactionData.total_discount;
      transactionData.cash_back =
        payment.cash +
        payment.credit +
        payment.debit +
        payment.ojol +
        payment.transfer -
        transactionData.total_nett;

      const customerTypeId = localStorage.getItem("customerTypeId") as string;
      const integerCustomerTypeId = parseInt(customerTypeId);
      console.log("initeger: " + integerCustomerTypeId);
      await axios.put(
        `${baseURL}/sales-transaction/${transactionData.id}`,
        {
          sales_transaction_number: transactionData.sales_transaction_number,
          sales_transaction_status: transactionData.sales_transaction_status,
          total_price: transactionData.total_price,
          total_discount: transactionData.total_discount,
          total_paid_cash: transactionData.total_paid_cash,
          total_paid_debit: transactionData.total_paid_debit,
          total_paid_credit: transactionData.total_paid_credit,
          total_paid_transfer: transactionData.total_paid_transfer,
          total_paid_ojol: transactionData.total_paid_ojol,
          total_nett: transactionData.total_nett,
          cash_back: transactionData.cash_back,
          user_id: transactionData.user_id,
          customer_type_id: parseInt(customerTypeId),
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      if (
        (updatingStatus == true && addTransaction) ||
        (updating == true && addTransaction)
      ) {
        setPayment({
          cash: 0,
          debit: 0,
          credit: 0,
          transfer: 0,
          ojol: 0,
          addedDiscount: 0,
          roundDown: 0,
        });
      }

      setUpdatingStatus(false);
      setInitialTransaction(true);
      clearTransactionAndItems();
    } else {
      transactionData.sales_transaction_status = status;
      if (data != null) {
        transactionData = data;

        console.log("Updating transaction status");
        console.log(transactionData);
        console.log(data);
        console.log(`status: ${transactionData.sales_transaction_status}`);
        console.log(`status data: ${data?.sales_transaction_status}`);

        await axios.put(
          `${baseURL}/sales-transaction/${transactionData.id}`,
          {
            sales_transaction_number: transactionData.sales_transaction_number,
            sales_transaction_status: transactionData.sales_transaction_status,
            total_price: transactionData.total_price,
            total_discount: transactionData.total_discount,
            total_paid_cash: transactionData.total_paid_cash,
            total_paid_debit: transactionData.total_paid_debit,
            total_paid_credit: transactionData.total_paid_credit,
            total_paid_transfer: transactionData.total_paid_transfer,
            total_paid_ojol: transactionData.total_paid_ojol,
            total_nett: transactionData.total_nett,
            cash_back: transactionData.cash_back,
            user_id: transactionData.user_id,
            customer_type_id: transactionData.customer_type_id,
          },
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
      }

      // console.log(`add transaction boolean: ${addTransaction}`);
      if (
        (updatingStatus == true && addTransaction == false) ||
        (updating == true && addTransaction == false)
      ) {
        console.log("reset payment");
        setPayment({
          cash: 0,
          debit: 0,
          credit: 0,
          transfer: 0,
          ojol: 0,
          addedDiscount: 0,
          roundDown: 0,
        });
      }

      setUpdatingStatus(false);
      setInitialTransaction(true);
      clearTransactionAndItems();
    }
  };

  const clearTransactionAndItems = () => {
    let transactionData: SalesTransactionWrite = transaction;
    transactionData.id = -1;
    transactionData.total_price = 0;
    transactionData.total_discount = 0;
    transactionData.sales_transaction_number = "";
    transactionData.total_paid_cash = 0;
    transactionData.total_paid_debit = 0;
    transactionData.total_paid_transfer = 0;
    transactionData.total_paid_ojol = 0;
    transactionData.sales_transaction_status = "";
    setTransaction(transactionData);
    setDiscountPercentage(-1);
    setItems([]);
    localStorage.removeItem("customerType");
    localStorage.removeItem("customerTypeId");
    localStorage.removeItem("customerDiscount");
    localStorage.setItem("setCustomerType", "none");
    setShowMenu(false);
  };

  const getAllTransactionThisShif = async () => {
    const user = localStorage.getItem("userData");
    let AllTransactionThisShif = Array<SalesTransactionReadWithCreateAt>();
    try {
      if (user) {
        const dataUser: User = JSON.parse(user);
        const responseOne = await axios.get(`${baseURL}/user/${dataUser.id}`);
        const userReadData: UserRead = responseOne.data;
        const responseTwo = await axios.post(
          `${baseURL}/sales-transaction/last-login/` + dataUser.id,
          { lastLogin: userReadData.last_login },
          { headers: { Authorization: accessToken } }
        );
        AllTransactionThisShif = responseTwo.data;

        return AllTransactionThisShif;
      }
    } catch (error) {
      return AllTransactionThisShif;
    }
    return AllTransactionThisShif;
  };

  useEffect(() => {
    if (updatingStatus == false) {
      // console.log("this is add new transaction");
      finilizedTransaction();
    } else if (updatingStatus == true && addTransaction == true) {
      finilizedTransaction("DONE", true);
    }
  }, [payment]);

  useEffect(() => {
    if (initialTransaction === false) {
      // console.log("Initial transaction");
      setInitialTransaction(true);
      setupTransaction();
    }
  }, []);

  useEffect(() => {
    // console.log(items);
    let finalTotalPrice = 0;
    items.map((item, index) => {
      const discounted =
        item.product_price * item.quantity * (discountPercentage / 100);
      const itemPrice = item.product_price * item.quantity;
      let finalPrice = 0;
      if (
        item.product_type_code == "TCPKC" ||
        item.product_type_code == "TCPKP" ||
        item.product_type_code == "TCPSS"
      ) {
        const updatedItems: ItemTransactionWriteWithItemData[] = items;
        updatedItems[index].discount = discounted;
        setItems(updatedItems);
        finalPrice = itemPrice - discounted;
      } else {
        finalPrice = itemPrice;
      }
      finalTotalPrice += finalPrice;
    });
    setTotalPrice(finalTotalPrice);
    if (updatingStatus == false) {
      setupTransaction();
    }
  }, [items, discountPercentage]);

  const printShiftWhenLogout = () => {
    handlePrintShift();
  };

  const shiftComponentRef = useRef(null);
  const handlePrintShift = useReactToPrint({
    content: () => shiftComponentRef.current,
  });

  return (
    <>
      <div className="hidden">
        <ShiftReport
          transaction={transaction}
          getAllTransactionThisShif={getAllTransactionThisShif}
          payment={payment}
          ref={shiftComponentRef}
        />
      </div>
      <TransactionList
        showTransactionList={showTransactionList}
        setShowTransactionList={setShowTransactionList}
        getAllTransactionThisShif={getAllTransactionThisShif}
        setUpdatingStatus={setUpdatingStatus}
        setItems={setItems}
        setTransaction={setTransaction}
        setDiscountPercentage={setDiscountPercentage}
      />
      <Checkout
        setAddTransaction={setAddTransaction}
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        setPayment={setPayment}
        totalPrice={totalPrice}
        item={items}
        transaction={transaction}
        discountPercentage={discountPercentage}
      />
      <div
        className={`${
          showCheckout || showTransactionList ? "hidden" : ""
        } w-screen h-screen bg-slate-300 p-2`}
      >
        <div className="grid grid-cols-12 gap-4 h-full">
          <div className="col-span-1 bg-white rounded-md shadow-md px-2 py-3 h-full flex flex-col">
            <Navigation
              getAllTransactionThisShif={getAllTransactionThisShif}
              showTransactionList={showTransactionList}
              setShowTransactionList={setShowTransactionList}
              printShiftWhenLogout={printShiftWhenLogout}
            />
          </div>
          <div className="col-span-7 bg-white rounded-md shadow-md p-3 h-full">
            <div className="flex flex-col h-full gap-2">
              <div className="h-1/4 bg-slate-300 rounded-md shadow-lg p-3">
                <TotalPrice totalPrice={totalPrice} items={items} />
              </div>
              <div className="h-3/4 bg-slate-300 rounded-md shadow-lg p-3 ">
                <div className="relative h-[480px] w-full overflow-hidden">
                  <div className="max-h-full overflow-y-auto no-scrollbar">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Kode barang
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Nama barang
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            Qty
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Satuan
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Harga satuan
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Diskon
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          return (
                            <>
                              <Row
                                item={item}
                                items={items}
                                setItems={setItems}
                                discountPercentage={discountPercentage}
                                key={"row_" + index}
                              />
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 bg-white rounded-md shadow-md p-3 h-full">
            <div className="flex flex-col h-full gap-2">
              <div className="bg-slate-300 w-full h-2/6 rounded-md shadow-lg p-3">
                <Customer
                  setShowMenu={setShowMenu}
                  setDiscountPercenteage={setDiscountPercentage}
                />
              </div>
              <div className="bg-slate-300 w-full h-3/6 rounded-md shadow-lg p-3">
                <div
                  className={showMenu ? "flex flex-row h-full gap-2" : "hidden"}
                >
                  <Menu
                    setItems={setItems}
                    items={items}
                    discountPercentage={discountPercentage}
                  />
                </div>
              </div>
              <div className="bg-slate-300 w-full h-1/6 rounded-md shadow-lg p-3">
                <ActionTransaction
                  setShowCheckout={setShowCheckout}
                  setTransaction={setTransaction}
                  transaction={transaction}
                  setUpdatingStatus={setUpdatingStatus}
                  finilizedTransaction={finilizedTransaction}
                  clearTransactionAndItems={clearTransactionAndItems}
                  setAddTransaction={setAddTransaction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
