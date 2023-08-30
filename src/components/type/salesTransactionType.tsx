import { CustomerType } from "../pos/menu/Customer";
import { User } from "./userType";

export type SalesTransactionWrite = {
  id: number;
  sales_transaction_number: string;
  sales_transaction_status: string;
  total_price: number;
  total_discount: number;
  total_paid_cash: number;
  total_paid_debit: number;
  total_paid_credit: number;
  total_paid_transfer: number;
  total_paid_ojol: number;
  total_nett: number;
  cash_back: number;
  user_id: number;
  customer_type_id: number;
};

export type SalesTransactionRead = {
  id: number;
  sales_transaction_number: string;
  sales_transaction_status: string;
  total_price: number;
  total_discount: number;
  total_paid_cash: number;
  total_paid_debit: number;
  total_paid_credit: number;
  total_paid_transfer: number;
  total_paid_ojol: number;
  total_nett: number;
  cash_back: number;
  user: User;
  customer_type: CustomerType;
};

export type SalesTransactionReadWithCreateAt = {
  id: number;
  sales_transaction_number: string;
  sales_transaction_status: string;
  total_price: number;
  total_discount: number;
  total_paid_cash: number;
  total_paid_debit: number;
  total_paid_credit: number;
  total_paid_transfer: number;
  total_paid_ojol: number;
  total_nett: number;
  cash_back: number;
  user: User;
  customer_type: CustomerType;
  createdAt: Date;
};
