import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../shared/models/course";
import {UserInfo} from "../../shared/models/user-info";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {


  @Input() promotedCourses: Course[];

  activeCourseIndex: number = 0; // Index of the currently active promotional course

  constructor() { }

  ngOnInit(): void { }


/*
  // Method to show the next course in the array
  nextCourse(): void {
    if (this.activeCourseIndex < this.promotedCourses.length - 1) {
      this.activeCourseIndex++;
    } else {
      this.activeCourseIndex = 0; // Loop back to the start
    }
  }

  // Method to show the previous course in the array
  prevCourse(): void {
    if (this.activeCourseIndex > 0) {
      this.activeCourseIndex--;
    } else {
      this.activeCourseIndex = this.promotedCourses.length - 1; // Loop back to the end
    }
  }

  // Optional: Automatically rotate through courses after a set interval
  autoRotateCourses(): void {
    setInterval(() => {
      this.nextCourse();
    }, 5000); // Change course every 5 seconds, adjust as needed
  }
*/




}
