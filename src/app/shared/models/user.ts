import {Course} from "./course";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  joinedDate: Date;
  status: string;
  role: string;
  wishlistCourses: Course[];

}
