import {Course} from "./course";
import {User} from "./user";


export interface Review {
  id: number;

  course: Course;
  user: User;

  rating: number;

  content: string;

  createTime: Date;

  updateTime: Date;
}
