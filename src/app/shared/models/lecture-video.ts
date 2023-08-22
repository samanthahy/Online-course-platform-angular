export interface LectureVideo {
  id? : number;
  lectureId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  s3ObjectKey: string;
  uploadTime: Date;
}
