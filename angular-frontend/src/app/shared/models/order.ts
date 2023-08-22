import {OrderCourse} from "./order-course";


export interface Order {
  id: number;
  purchaseDate: Date;
  userId: number;
  total: number;
  orderNumber: string;
  purchases: OrderCourse[];
  paymentType: string;
}
