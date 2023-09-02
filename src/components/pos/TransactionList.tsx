import React, { useEffect, useState } from "react";
import {
  SalesTransactionReadWithCreateAt,
  SalesTransactionWrite,
} from "../type/salesTransactionType";
import RowCurrentTransactions from "./table_component/RowCurrentTransactions";
import {
  ItemTransactionRead,
  ItemTransactionWriteWithItemData,
} from "../type/itemTransactionType";
import axios from "axios";
import { CustomerType } from "./menu/Customer";

interface TransactionListProps {
  showTransactionList: boolean;
  setUpdatingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTransactionList: React.Dispatch<React.SetStateAction<boolean>>;
  getAllTransactionThisShif: () => Promise<SalesTransactionReadWithCreateAt[]>;
  setTransaction: React.Dispatch<React.SetStateAction<SalesTransactionWrite>>;
  setItems: React.Dispatch<
    React.SetStateAction<ItemTransactionWriteWithItemData[]>
  >;
}

export default function TransactionList({
  showTransactionList,
  setUpdatingStatus,
  setShowTransactionList,
  getAllTransactionThisShif,
  setTransaction,
  setItems,
}: TransactionListProps) {
  const [transactionList, setTransactionList] = useState<
    SalesTransactionReadWithCreateAt[]
  >([]);

  const accessToken = localStorage.getItem("accessToken") as string;
  // const baseURL = "https://pos-backend.piasarimurni.site/api";
  const baseURL = "https://127.0.0.1:4000/api";

  const setNewTransaction = async (transactionId: number) => {
    let customerId = 0;

    console.log("Setting new transaction");
    transactionList.forEach((item) => {
      if (transactionId == item.id) {
        customerId = item.customer_type.id;
        setTransaction({
          id: item.id,
          sales_transaction_number: item.sales_transaction_number,
          sales_transaction_status: item.sales_transaction_status,
          total_price: item.total_price,
          total_discount: item.total_discount,
          total_paid_cash: item.total_paid_cash,
          total_paid_debit: item.total_paid_credit,
          total_paid_credit: item.total_paid_transfer,
          total_paid_transfer: item.total_paid_transfer,
          total_paid_ojol: item.total_paid_ojol,
          total_nett: item.total_nett,
          cash_back: item.cash_back,
          user_id: item.user.id,
          customer_type_id: item.customer_type.id,
        });
      }
    });

    console.log("getting items");

    const getItems: ItemTransactionRead[] = await setNewItemList(transactionId);
    let newSetItems: ItemTransactionWriteWithItemData[] = [];

    let getDiscountPercentage = 0;

    const getCustomerType: CustomerType = await axios.get(
      `${baseURL}/customer-type/${customerId}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    if (getCustomerType.customer_type_code == "TKOA") {
      getDiscountPercentage = 10;
    }
    if (getCustomerType.customer_type_code == "TKOB") {
      getDiscountPercentage = 15;
    }
    if (getCustomerType.customer_type_code == "TKOC") {
      getDiscountPercentage = 20;
    }
    if (getCustomerType.customer_type_code == "TKOD") {
      getDiscountPercentage = 22.5;
    }

    getItems.forEach((item) => {
      const discounted =
        item.product.price * item.quantity * (getDiscountPercentage / 100);
      newSetItems.push({
        id: item.id,
        quantity: item.quantity,
        product_id: item.product.id,
        sales_transaction_id: item.sales_transaction.id,
        product_code: item.product.product_code,
        product_name: item.product.product_name,
        product_price: item.product.price,
        product_type_code: item.product.product_code,
        discount: discounted,
        isBox: false,
      });
    });

    console.log("Setting new items");
    setItems([...newSetItems]);
  };

  const setNewItemList = async (transaction_id: number) => {
    const getItems = await axios.post(
      `${baseURL}/item-transaction/by-transaction-id/${transaction_id}`,
      {},
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(`get item transaction: ${getItems}`);
    console.log(getItems);
    return getItems.data;
  };

  useEffect(() => {
    getAllTransactionThisShif().then((data) => {
      console.log(data);
      setTransactionList([...data]);
    });
  }, [showTransactionList]);

  return (
    <div
      className={
        showTransactionList
          ? "bg-slate-400 w-screen h-screen p-4 z-10"
          : "hidden"
      }
    >
      <div className="bg-white rounded-md shadow-xl w-full h-full flex p-5 gap-2">
        <div className="flex flex-col w-full h-full">
          <div className="w-full text-center font-bold text-3xl">
            <h1>DAFTAR TRANSAKSI</h1>
          </div>
          <div className="w-full h-5/6 py-2 px-1 flex">
            <div className="relative h-[520px] w-full overflow-hidden">
              <div className="max-h-full overflow-y-auto no-scrollbar">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No Transaksi
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Jam
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Jenis pelanggan
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total bayar
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionList.map((item) => {
                      return (
                        <RowCurrentTransactions
                          transactionData={item}
                          key={item.id}
                          setNewTransaction={setNewTransaction}
                          setShowTransactionList={setShowTransactionList}
                          setUpdatingStatus={setUpdatingStatus}
                          showTransactionList={showTransactionList}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="p-2 flex place-content-center">
            <button
              className=" bg-blue-500 text-white w-40 h-10 shadow-md rounded-md hover:bg-blue-700 selection:bg-blue-300"
              onClick={() => {
                setUpdatingStatus(false);
                setShowTransactionList(!showTransactionList);
              }}
            >
              back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
