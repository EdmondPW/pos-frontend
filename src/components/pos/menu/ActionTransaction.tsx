import { SalesTransactionWrite } from "../../type/salesTransactionType";

interface ActionTransactionProps {
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  setTransaction: React.Dispatch<React.SetStateAction<SalesTransactionWrite>>;
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
  finilizedTransaction,
  clearTransactionAndItems,
}: ActionTransactionProps) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => clearTransactionAndItems()}
            className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
          >
            CLEAR
          </button>
        </div>
        <div className="flex items-center justify-center">
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
                if (
                  transaction.sales_transaction_status != "DONE" &&
                  transaction.sales_transaction_status != "TUNDA"
                ) {
                  finilizedTransaction("TUNDA", false, transactionData);
                }
              }}
              className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
            >
              TUNDA
            </button>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="bg-blue-400 focus:bg-blue-500 w-40 h-20 rounded-lg border-2 border-slate-700 focus:border-blue-700 focus:border-4 font-bold text-white"
          >
            BAYAR
          </button>
        </div>
      </div>
    </>
  );
}
