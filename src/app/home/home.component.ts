import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {CourseService} from "../shared/services/course.service";
import {Course} from "../shared/models/course";
import {AuthService} from "../shared/services/auth.service";
import {UserInfo} from "../shared/models/user-info";
import {UserInfoService} from "../shared/services/user-info.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  promotedCourses: Course[];
  currentUser: UserInfo | undefined;


  constructor(private us: UserService,
              private cs: CourseService,
              private auth: AuthService,
              private uis: UserInfoService) { }


  ngOnInit() {
    this.cs.getPromotedCourses().subscribe(courses => {
      this.promotedCourses = courses;
    });
    if (this.auth.user) {
      const userId = this.auth.user.id;
      this.uis.getUserInfoByUserId(userId).subscribe(userInfo => {
        this.currentUser = userInfo;
      });
    }
  }
}
