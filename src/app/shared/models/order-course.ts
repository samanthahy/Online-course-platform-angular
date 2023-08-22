import {Course} from "./course";
import {Order} from "./order";

export interface OrderCourse {
  id: number;
  course: Course;
  order: Order;
  sellingPrice: number;

}
