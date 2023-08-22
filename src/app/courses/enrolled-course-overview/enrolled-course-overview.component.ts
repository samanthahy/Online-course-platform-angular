import {Component, Input} from '@angular/core';
import {Enrollment} from "../../shared/models/enrollment";
import {Course} from "../../shared/models/course";
import {UserInfo} from "../../shared/models/user-info";

@Component({
  selector: 'app-enrolled-course-overview',
  templateUrl: './enrolled-course-overview.component.html',
  styleUrls: ['./enrolled-course-overview.component.scss']
})
export class EnrolledCourseOverviewComponent {

  @Input()
  enrollment: Enrollment;

  @Input()
  instructor?: UserInfo;


  getCourseLink(enrollment: Enrollment): string[] {
    const courseId = enrollment.course.id;
    const lectureId = this.getFirstLectureId(enrollment.course);

    if (lectureId !== null) {
      return ['/course-detail', courseId.toString(), 'learn', 'lecture', lectureId.toString()];
    } else {
      // Handle the case where lectureId is null, for example, you might redirect to a default route
      return ['/course-detail', courseId.toString()];
    }
  }



  getFirstLectureId(course: Course): number | null {
    for (const section of course.sectionList) {
      if (section.lectures && section.lectures.length > 0) {
        return section.lectures[0].id;
      }
    }
    return null; // Return null if no lecture ID is found
  }


}
