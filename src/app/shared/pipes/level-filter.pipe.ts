import {Pipe, PipeTransform} from "@angular/core";
import {Course} from "../models/course";

@Pipe({
  name: 'levelFilter'
})

export class LevelFilterPipe implements PipeTransform {
 /* transform(courses: Course[],
            levelFilter: any) {
    if(levelFilter.length > 0) {
      return courses.filter(x => {
        const lFilter = levelFilter.find((v: {id: number, name: string, checked: boolean}) =>
          v.name === x.level);
        return lFilter != null;
      });
    } else return courses;
  }*/


  transform(courses: Course[], levelFilter: string[]) {
    if (levelFilter.length > 0) {
      return courses.filter(course => levelFilter.includes(course.level));
    }
    return courses;
  }
}
