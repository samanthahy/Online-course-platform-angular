import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Lecture} from "../../../shared/models/lecture";
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../../shared/services/course.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-play-window',
  templateUrl: './play-window.component.html',
  styleUrls: ['./play-window.component.scss']
})
export class PlayWindowComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  videoUrl: string;
  lecture: Lecture;
  lectureId: number;

  constructor(
    private ar: ActivatedRoute,
    private cs: CourseService) { }

  ngOnInit(): void {
    this.ar.paramMap
      .pipe(
        switchMap(params => {
          this.lectureId = Number(params.get('lectureId')); // Adjust the parameter name based on your route configuration
          return this.cs.getLectureById(this.lectureId);
        })
      )
      .subscribe({
        next: lecture => {
          this.lecture = lecture;
          this.videoUrl = lecture.lectureVideo.filePath; // Adjust based on your lecture object structure
        },
        error: err => {
          console.log(err);
        }
      });
  }
  playVideo() {
    this.videoPlayer.nativeElement.play();
  }

  pauseVideo() {
    this.videoPlayer.nativeElement.pause();
  }

}
