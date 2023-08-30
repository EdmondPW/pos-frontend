import { ProductRead } from "./productType";
import { SalesTransactionRead } from "./salesTransactionType";

export type ItemTransactionRead = {
  id: number;
  quantity: number;
  product: ProductRead;
  sales_transaction: SalesTransactionRead;
};

export type ItemTransactionWrite = {
  id: number;
  quantity: number;
  product_id: number;
  sales_transaction_id: number;
};

export type ItemTransactionWriteWithItemData = {
  id: number;
  quantity: number;
  product_id: number;
  sales_transaction_id: number;
  product_code: string;
  product_name: string;
  product_price: number;
  product_type_code: string;
  discount: number;
  isBox: boolean;
};
