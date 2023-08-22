import {Pipe, PipeTransform} from "@angular/core";
import {Course} from "../models/course";

@Pipe({
  name: 'languageFilter'
})

export class LanguageFilterPipe implements PipeTransform {
/*  transform(courses: Course[],
            languageFilter: any) {
    if (languageFilter.length > 0) {
      return courses.filter(x => {
        const lFilter = languageFilter.find((v: {id: number, name: string, checked: boolean}) =>
          v.name === x.language);
        return lFilter != null;
      });
    } else return courses;
  }*/

  transform(courses: Course[], languageFilter: string[]) {
    if (languageFilter.length > 0) {
      return courses.filter(course => languageFilter.includes(course.language));
    }
    return courses;
  }

}
