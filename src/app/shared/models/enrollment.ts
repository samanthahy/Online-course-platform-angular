import {User} from "./user";
import {Course} from "./course";
import {Refund} from "./refund";

export interface Enrollment {
  id: number;
  user: User;
  course: Course;
  progress: number;
  enrollDate: Date;
  refund?: Refund;
}
