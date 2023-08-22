import {Pipe, PipeTransform} from "@angular/core";
import {LanguageFilterPipe} from "./language-filter.pipe";
import {Course} from "../models/course";

@Pipe({
  name: 'priceFilter'
})

export class PriceFilterPipe implements PipeTransform {
/*  transform(courses: Course[],priceFilter: any[]) {
    if (priceFilter.length > 0) {
      return courses.filter(course => {
        const pFilter = priceFilter.find(p =>
          (p.name === "Free" && course.price === 0) ||
          (p.name === "Paid" && course.price > 0));
        return pFilter != null;
      });
    } else return courses;
  }*/

  transform(courses: Course[], priceFilter: string[]) {
    if (priceFilter.includes('Free') && priceFilter.includes('Paid')) {
      return courses;
    } else if (priceFilter.includes('Free')) {
      return courses.filter(course => course.price === 0);
    } else if (priceFilter.includes('Paid')) {
      return courses.filter(course => course.price > 0);
    }
    return courses;
  }

}
