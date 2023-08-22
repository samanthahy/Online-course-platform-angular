import {LevelTwoCategory} from "./LevelTwoCategory";

export interface LevelOneCategory {
  name: string;
  path: string;
  children: LevelTwoCategory[];
}
