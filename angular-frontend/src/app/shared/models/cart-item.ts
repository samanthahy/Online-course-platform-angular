import {ShoppingSession} from "./shopping-session";
import {Course} from "./course";

export interface CartItem{
  id?: number;
  shoppingSession: ShoppingSession;
  course: Course;
}
