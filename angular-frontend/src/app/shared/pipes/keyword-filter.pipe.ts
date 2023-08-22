import { Pipe, PipeTransform } from '@angular/core';
import {Course} from "../models/course";
import {UserInfo} from "../models/user-info";

@Pipe({
  name: 'keywordFilter'
})
export class KeywordFilterPipe implements PipeTransform {

  transform(courses: Course[], searchTerm: string, instructorUserInfoMap: Map<number, UserInfo>): Course[] {
    // console.log("Pipe Invoked with term:", searchTerm); // log statement

    if (!courses || !searchTerm) {
      return courses;
    }

    const searchTermLower = searchTerm.toLowerCase();

    const filteredCourses = courses.filter(course => {
      let instructor = instructorUserInfoMap.get(course.instructor.id);
      let instructorFirstName = instructor ? instructor.firstname : '';
      let instructorLastName = instructor ? instructor.lastname : '';


      return course.name.toLowerCase().includes(searchTermLower) ||
        (course.description && course.description.toLowerCase().includes(searchTermLower)) ||
        (course.overview && course.overview.toLowerCase().includes(searchTermLower)) ||
        (course.learningOutcomes && course.learningOutcomes.toLowerCase().includes(searchTermLower)) ||
        (course.prerequisites && course.prerequisites.toLowerCase().includes(searchTermLower)) ||
        (instructorFirstName && instructorFirstName.toLowerCase().includes(searchTermLower)) ||
        (instructorLastName && instructorLastName.toLowerCase().includes(searchTermLower));
    });

    console.log("Filtered Courses:", filteredCourses); // log statement
    return filteredCourses;
  }



}
