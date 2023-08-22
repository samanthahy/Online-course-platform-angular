import {Section} from "./section";
import {LectureVideo} from "./lecture-video";

export interface Lecture {
  id : number;
  section: Section;
  title: string;
  lectureVideo: LectureVideo;
  duration: number;
}
