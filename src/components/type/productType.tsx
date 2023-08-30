import { ProductType } from "./productTypeContext";

export type ProductRead = {
  id: number;
  product_code: string;
  product_name: string;
  price: number;
  stock: number;
  product_type: ProductType;
};
