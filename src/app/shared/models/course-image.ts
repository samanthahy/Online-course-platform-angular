export interface CourseImage {
  id? : number;
  courseId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  s3ObjectKey: string;
  uploadTime: Date;
}
