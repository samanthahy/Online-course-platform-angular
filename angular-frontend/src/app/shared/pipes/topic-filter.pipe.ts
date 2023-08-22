import {Pipe, PipeTransform} from "@angular/core";
import {Course} from "../models/course";
import {Category} from "../models/category";

@Pipe({
  name: 'topicFilter'
})

export class TopicFilterPipe implements PipeTransform {
/*  transform(courses: Course[],
            topicFilter: any,
            categories: Category[]) {
    if (topicFilter.length > 0) {
      return courses.filter(x => {
        // find the category in the list of categories
        const category = categories.find(c => c.id === x.category.id);

        // if the category was found, check if its name is in the filter
        if (category) {
          const tFilter = topicFilter.find((v: string) => v === category.name);
          return tFilter != null;
        } else {
          // if the category was not found, exclude the course from the results
          return false;
        }
      });
    } else return courses;
  }*/


  transform(courses: Course[], topicFilter: string[]) {
    if (topicFilter.length > 0) {
      return courses.filter(course => topicFilter.includes(course.category.name));
    }
    return courses;
  }
}



