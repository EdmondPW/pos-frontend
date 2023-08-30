import React from "react";
import { SalesTransactionReadWithCreateAt } from "../../type/salesTransactionType";

interface RowCurrentTransactionsProps {
  transactionData: SalesTransactionReadWithCreateAt;
  showTransactionList: boolean;
  setNewTransaction: (transactionId: number) => Promise<void>;
  setShowTransactionList: (value: React.SetStateAction<boolean>) => void;
  setUpdatingStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RowCurrentTransactions({
  transactionData,
  showTransactionList,
  setNewTransaction,
  setShowTransactionList,
  setUpdatingStatus,
}: RowCurrentTransactionsProps) {
  const newTime = new Date(transactionData.createdAt);

  const formatedHour = newTime.getHours();
  const formatedMinute = newTime.getMinutes();
  const formatedTime = formatedHour + ":" + formatedMinute;

  return (
    <tr className="bg-black border-b bg-opacity-5 border-white">
      <th className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
        {transactionData.sales_transaction_number}
      </th>
      <td className="px-5 py-4">{formatedTime}</td>
      <td className="px-5 py-4">{transactionData.sales_transaction_status}</td>
      <td className="px-5 py-4 ">
        {transactionData.customer_type.customer_type_name}
      </td>
      <td className="px-5 py-4">{transactionData.total_nett}</td>
      <td className="px-5 py-4">
        {transactionData.sales_transaction_status == "VOID" ? (
          <button
            className={"bg-red-400 w-14 h-7 text-white rounded-lg"}
            disabled
            onClick={() => {
              setNewTransaction(transactionData.id);
              setShowTransactionList(!showTransactionList);
              setUpdatingStatus(true);
            }}
          >
            Pilih
          </button>
        ) : (
          <button
            className={
              transactionData.sales_transaction_status == "TUNDA"
                ? "bg-yellow-400 w-14 h-7 text-white rounded-lg"
                : "bg-green-400  w-14 h-7 text-white rounded-lg"
            }
            onClick={() => {
              setNewTransaction(transactionData.id);
              setShowTransactionList(!showTransactionList);
              setUpdatingStatus(true);
            }}
          >
            Pilih
          </button>
        )}
      </td>
    </tr>
  );
}
