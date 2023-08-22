import {Pipe, PipeTransform} from "@angular/core";
import {Course} from "../models/course";

@Pipe({
  name: 'ratingFilter'
})

export class RatingFilterPipe implements PipeTransform {
  transform(courses: Course[],
            selectedRating: number) {
    if (!courses) return [];
    if (!selectedRating) return courses;

    return courses.filter(course => course.rating >= selectedRating);
  }
}
