import {Section} from "./section";
import {User} from "./user";
import {Category} from "./category";
import {CourseImage} from "./course-image";

export interface Course {
  id: number;
  name: string;
  instructor: User;
  overview: string;
  learningOutcomes: string;
  prerequisites: string;
  description: string;
  rating: number;
  category: Category;
  level: string;
  price: number;
  courseImage: CourseImage;
  discount: number;
  language: string;
  status: string;
  sectionList: Section[];
}
