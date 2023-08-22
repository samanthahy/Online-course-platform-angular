import {Component, Input, OnInit} from "@angular/core";
import {CurrencyService} from "../../shared/services/currency.service";
import {Enrollment} from "../../shared/models/enrollment";
import {Course} from "../../shared/models/course";
import {UserInfo} from "../../shared/models/user-info";

@Component ({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})

export class CourseListComponent implements OnInit{

  @Input()
  course: Course;

  @Input()
  instructor?: UserInfo

  starRating: number = 0;

  constructor(public  cs: CurrencyService) {}


  ngOnInit(): void {
    this.starRating = this.course.rating;
  }



  getCourseLink(course: Course): string[] {
    const courseName = course.name.replace(/\s+/g, '-').toLowerCase();

    return ['/course', courseName];
  }

}
