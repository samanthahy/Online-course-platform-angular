import {Component, Input} from '@angular/core';
import {Course} from "../../shared/models/course";
import {UserInfo} from "../../shared/models/user-info";

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent {


  @Input()
  course: Course;

  @Input()
  instructor?: UserInfo;


  getTotalCourseDuration(course: Course): string {
    const totalDurationInSeconds = course.sectionList.reduce((total, section) => {
      return total + section.lectures.reduce((total, lecture) => {
        return total + this.durationToSeconds(lecture.duration);
      }, 0);
    }, 0);

    return Math.ceil(totalDurationInSeconds/3600).toString();
  }



  secondsToTimeFormat(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    const formattedHours = ("0" + hours).slice(-2);
    const formattedMinutes = ("0" + minutes).slice(-2);
    const formattedSeconds = ("0" + seconds).slice(-2);

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

  durationToSeconds(duration: any): number {
    if (!duration) {
      return 0;
    }

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (match[1])
      hours = parseInt(match[1].replace('H', ''));
    if (match[2])
      minutes = parseInt(match[2].replace('M', ''));
    if (match[3])
      seconds = parseInt(match[3].replace('S', ''));

    return hours * 3600 + minutes * 60 + seconds;
  }

// Function to get total number of lectures in a course
  getTotalLectures(course: Course): number {
    return course.sectionList.reduce((total, section) => {
      return total + section.lectures.length;
    }, 0);
  }
}
