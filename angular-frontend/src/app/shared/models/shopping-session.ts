import {CartItem} from "./cart-item";

export interface ShoppingSession {
  id: number;
  userId: number;
  total: number;
  cartItems: CartItem[];
}
