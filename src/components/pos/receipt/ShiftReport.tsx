import { Ref, forwardRef, useEffect, useState } from "react";
import {
  SalesTransactionRead,
  SalesTransactionWrite,
} from "../../type/salesTransactionType";
import { Payment, formatingValue } from "../PosDashboard";

interface ShiftReport {
  getAllTransactionThisShif: () => Promise<SalesTransactionRead[]>;
  payment: Payment;
  transaction: SalesTransactionWrite;
}

const ShiftReport = forwardRef(
  (
    { getAllTransactionThisShif, payment, transaction }: ShiftReport,
    ref: Ref<HTMLDivElement>
  ) => {
    const [tunaiIncome, setTunaiIncome] = useState("0");
    const [debitIncome, setDebitIncome] = useState("0");
    const [creditIncome, setCreditIncome] = useState("0");
    const [transferIncome, setTransferIncome] = useState("0");

    const [grabIncome, setGrabIncome] = useState("0");
    const [gojekIncome, setGojekIncome] = useState("0");
    const [shopeeIncome, setShopeeIncome] = useState("0");

    const [shiftTransactions, setShifTransactions] = useState<
      SalesTransactionRead[]
    >([]);

    const [needRender, setNeedRender] = useState(false);
    const [finishRender, setFinishRender] = useState(false);

    const calculateCashReceive = async (
      _shiftTransactions: SalesTransactionRead[]
    ) => {
      console.log("Shift calculating...");
      let tempTunai = 0;
      let tempDebit = 0;
      let tempCredit = 0;
      let tempTransfer = 0;

      let tempGrab = 0;
      let tempGojek = 0;
      let tempShopee = 0;
      _shiftTransactions.forEach((transaction) => {
        if (
          transaction.sales_transaction_status != "VOID" &&
          transaction.sales_transaction_status != "TUNDA"
        ) {
          if (
            transaction.customer_type.customer_type_code == "TKOA" ||
            transaction.customer_type.customer_type_code == "TKOB" ||
            transaction.customer_type.customer_type_code == "TKOC" ||
            transaction.customer_type.customer_type_code == "TKOD"
          ) {
            tempTunai += transaction.total_paid_cash - transaction.cash_back;
            tempDebit += transaction.total_paid_debit;
            tempCredit += transaction.total_paid_credit;
            tempTransfer += transaction.total_paid_transfer;
          }
          if (transaction.customer_type.customer_type_code == "GJK") {
            tempGojek += transaction.total_paid_ojol;
          }
          if (transaction.customer_type.customer_type_code == "GRB") {
            tempGrab += transaction.total_paid_ojol;
          }
          if (transaction.customer_type.customer_type_code == "SHP") {
            tempShopee += transaction.total_paid_ojol;
          }
        }
      });

      const fomratedTunai = formatingValue(tempTunai);
      const fomratedDebit = formatingValue(tempDebit);
      const formatedCredit = formatingValue(tempCredit);
      const formatedTransfer = formatingValue(tempTransfer);
      setTunaiIncome(fomratedTunai);
      setCreditIncome(formatedCredit);
      setDebitIncome(fomratedDebit);
      setTransferIncome(formatedTransfer);

      const formatedGrab = formatingValue(tempGrab);
      const formatedGojek = formatingValue(tempGojek);
      const formatedShopee = formatingValue(tempShopee);
      setGojekIncome(formatedGojek);
      setGrabIncome(formatedGrab);
      setShopeeIncome(formatedShopee);

      setShifTransactions(_shiftTransactions);

      setNeedRender(true);
    };

    useEffect(() => {
      console.log("calculate new transaction in this shif");
      getAllTransactionThisShif().then(async (res) => {
        await calculateCashReceive(res);
      });
    }, [
      payment,
      tunaiIncome,
      debitIncome,
      creditIncome,
      transferIncome,
      grabIncome,
      gojekIncome,
      shopeeIncome,
    ]);

    useEffect(() => {
      setNeedRender(true);
      getAllTransactionThisShif().then(async (res) => {
        await calculateCashReceive(res);
      });
    }, []);

    useEffect(() => {
      getAllTransactionThisShif().then((res) => setShifTransactions(res));
    }, [payment, transaction]);

    useEffect(() => {
      if (needRender && finishRender == false) {
        setNeedRender(false);
        setFinishRender(true);
      }
    }, [needRender, transaction, payment]);

    useEffect(() => {
      if (needRender == false && finishRender == true) {
        setFinishRender(false);
      }
    }, [finishRender]);

    useEffect(() => {
      if (needRender == false && finishRender == false) {
        setNeedRender(true);
      }
    }, [payment]);

    return (
      <>
        <div ref={ref} className="w-[288px]  flex flex-col items-center p-2">
          <br />
          <br />
          <p className="font-bold">LAPORAN AKHIR SHIFT</p>
          <br />
          <br />
          <br />
          <div className="flex flex-row w-full">
            <p className="mr-auto font-bold">Tunai</p>
            <p>{tunaiIncome}</p>
          </div>
          <div className="flex flex-col  w-full">
            <p className="font-bold">Non-Tunai</p>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">Debit</p>
              <p>{debitIncome}</p>
            </div>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">KK</p>
              <p>{creditIncome}</p>
            </div>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">Transfer</p>
              <p>{transferIncome}</p>
            </div>
          </div>
          <br />
          <br />
          <div className="flex flex-col w-full">
            <p className="font-bold">Ojek Online</p>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">Gojek</p>
              <p>{gojekIncome}</p>
            </div>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">Grab</p>
              <p>{grabIncome}</p>
            </div>
            <div className="flex flex-row">
              <p className="mr-auto ml-3">Shopee</p>
              <p>{shopeeIncome}</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div className="flex flex-col  w-full">
            <p className="font-bold">Struk VOID</p>
            {shiftTransactions.map((transaction) => {
              if (transaction.sales_transaction_status == "VOID") {
                return (
                  <div className="flex flex-row" key={transaction.id}>
                    <p className="mr-auto ml-3">
                      {transaction.sales_transaction_number}
                    </p>
                    <p>{transaction.total_nett}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <br />
        <br />
      </>
    );
  }
);

export default ShiftReport;
