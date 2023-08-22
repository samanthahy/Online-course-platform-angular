

export interface ProfileImage {
  id? : number;
  userId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  s3ObjectKey: string;
  uploadTime: Date;
}
