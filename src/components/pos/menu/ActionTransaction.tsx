import { SalesTransactionWrite } from "../../type/salesTransactionType";

interface ActionTransactionProps {
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  setTransaction: React.Dispatch<React.SetStateAction<SalesTransactionWrite>>;
  setAddTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdatingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  finilizedTransaction: (
    status: string,
    updating: boolean,
    data: SalesTransactionWrite
  ) => void;
  transaction: SalesTransactionWrite;
  clearTransactionAndItems: () => void;
}

export default function ActionTransaction({
  setShowCheckout,
  setTransaction,
  transaction,
  setAddTransaction,
  setUpdatingStatus,
  finilizedTransaction,
  clearTransactionAndItems,
}: ActionTransactionProps) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setUpdatingStatus(false);
              clearTransactionAndItems();
            }}
            className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
          >
            CLEAR
          </button>
        </div>
        <div className="flex items-center justify-center">
          {transaction.sales_transaction_status != "DONE" &&
          transaction.sales_transaction_status != "TUNDA" ? (
            <></>
          ) : (
            <button
              type="button"
              onClick={() => {
                let transactionData: SalesTransactionWrite = transaction;
                transactionData.sales_transaction_status = "VOID";
                console.log(transaction);
                setTransaction(transactionData);
                console.log("void di klik");
                console.log(
                  `void di klik ${transactionData.sales_transaction_status}`
                );
                finilizedTransaction("VOID", true, transactionData);
              }}
              className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
            >
              VOID
            </button>
          )}
        </div>
        <div className="flex items-center justify-center">
          {transaction.sales_transaction_status == "VOID" ? (
            <></>
          ) : (
            <button
              type="button"
              onClick={() => {
                let transactionData: SalesTransactionWrite = transaction;
                transactionData.sales_transaction_status = "TUNDA";
                setTransaction(transactionData);
                console.log("Tunda di klik");
                console.log(
                  `status tunda: ${transactionData.sales_transaction_status}`
                );
                if (
                  transactionData.sales_transaction_status != "DONE" &&
                  transactionData.sales_transaction_status != "VOID"
                ) {
                  setAddTransaction(true);
                  finilizedTransaction("TUNDA", false, transactionData);
                }
              }}
              className="hidden bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
            >
              TUNDA
            </button>
          )}
        </div>
        <div className="flex items-center justify-center">
          {transaction.sales_transaction_status != "DONE" ? (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
            >
              BAYAR
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
