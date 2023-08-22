import {Course} from "./course";
import {Lecture} from "./lecture";

export interface Section {
  id?: number;
  title: string;
  course: Course;
  lectures: Lecture[];

}
