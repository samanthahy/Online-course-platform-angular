import {LevelThreeCategory} from "./LevelThreeCategory";

export interface LevelTwoCategory {
  name: string;
  path: string;
  children: LevelThreeCategory[];
}
