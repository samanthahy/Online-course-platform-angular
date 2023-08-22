package com.mercury.OnlineCoursePlatformBackend.service;


import com.mercury.OnlineCoursePlatformBackend.dao.CourseImageDao;
import com.mercury.OnlineCoursePlatformBackend.dao.LectureDao;
import com.mercury.OnlineCoursePlatformBackend.dao.LectureVideoDao;
import com.mercury.OnlineCoursePlatformBackend.dao.ProfileImageDao;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Lecture;
import com.mercury.OnlineCoursePlatformBackend.model.bean.LectureVideo;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;


@Service
public class S3Service {


    private final String bucketName = "online-course-platform";

    String cloudFrontDomain = "https://d11n69elptcvjq.cloudfront.net";
    String s3Domain = String.format("https://%s.s3.us-west-2.amazonaws.com", bucketName);
    @Autowired
    private S3Client s3Client;

    @Autowired
    private ProfileImageDao profileImageDao;

    @Autowired
    private CourseImageDao courseImageDao;

    @Autowired
    private LectureVideoDao lectureVideoDao;

    @Autowired
    private LectureDao lectureDao;


    public ProfileImage uploadProfileImage(MultipartFile file, int userId) {
        // generate a unique file name
        String fileName = UUID.randomUUID().toString();

        // include the prefix in the key
        String key = "profile-image/" + fileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            throw new RuntimeException("Error while uploading profile image for user: " + userId, e);
        }

        // get the S3 object URL
        String s3Url = s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucketName).key(key).build()).toString();

        // replace the S3 domain with CloudFront domain
        String cloudFrontUrl = s3Url.replace(s3Domain, cloudFrontDomain);

        // check if there is an existing CourseImage for the courseId
        ProfileImage profileImage = profileImageDao.findByUserId(userId);
        if (profileImage != null) {
            // Delete the existing image from S3 bucket
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(profileImage.getS3ObjectKey())
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } else {
            // Create a new ProfileImage entity
            profileImage = new ProfileImage();
            profileImage.setUserId(userId);
        }

        // Update the profileImage properties
        profileImage.setS3ObjectKey(key);
        profileImage.setFileName(file.getOriginalFilename());
        profileImage.setFileSize(file.getSize());
        profileImage.setUploadTime(Timestamp.valueOf(LocalDateTime.now()));
        profileImage.setFilePath(cloudFrontUrl);
        profileImageDao.save(profileImage);

        return profileImage;
    }


    public CourseImage uploadCourseImage(MultipartFile file, int courseId) {
        // generate a unique file name
        String fileName = UUID.randomUUID().toString();

        // include the prefix in the key
        String key = "course-image/" + fileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            throw new RuntimeException("Error while uploading course image for course: " + courseId, e);
        }

        // get the S3 object URL
        String s3Url = s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucketName).key(key).build()).toString();

        // replace the S3 domain with CloudFront domain
        String cloudFrontUrl = s3Url.replace(s3Domain, cloudFrontDomain);

        // check if there is an existing CourseImage for the courseId
        CourseImage courseImage = courseImageDao.findByCourseId(courseId);

        if (courseImage != null) {
            // Delete the existing image from S3 bucket
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(courseImage.getS3ObjectKey())
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } else {
            // Create a new CourseImage entity
            courseImage = new CourseImage();
            courseImage.setCourseId(courseId);
        }

        // Update the CourseImage properties
        courseImage.setS3ObjectKey(key);
        courseImage.setFileName(file.getOriginalFilename());
        courseImage.setFileSize(file.getSize());
        courseImage.setUploadTime(Timestamp.valueOf(LocalDateTime.now()));
        courseImage.setFilePath(cloudFrontUrl);

        courseImageDao.save(courseImage);

        return courseImage;
    }


    public Lecture uploadLectureVideo(MultipartFile file, int lectureId) {
        // generate a unique file name
        String fileName = UUID.randomUUID().toString();

        // include the prefix in the key
        String key = "lecture-video/" + fileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            throw new RuntimeException("Error while uploading lecture video for lecture: " + lectureId, e);
        }

        // get the S3 object URL
        String s3Url = s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucketName).key(key).build()).toString();

        // replace the S3 domain with CloudFront domain
        String cloudFrontUrl = s3Url.replace(s3Domain, cloudFrontDomain);

        // check if there is an existing CourseImage for the courseId
        LectureVideo lectureVideo = lectureVideoDao.findByLectureId(lectureId);

        if (lectureVideo != null) {
            // Delete the existing image from S3 bucket
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(lectureVideo.getS3ObjectKey())
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } else {
            // Create a new CourseImage entity
            lectureVideo = new LectureVideo();
            lectureVideo.setLectureId(lectureId);
        }

        // Update the lectureVideo properties
        lectureVideo.setS3ObjectKey(key);
        lectureVideo.setFileName(file.getOriginalFilename());
        lectureVideo.setFileSize(file.getSize());
        lectureVideo.setUploadTime(Timestamp.valueOf(LocalDateTime.now()));
        lectureVideo.setFilePath(cloudFrontUrl);
        lectureVideoDao.save(lectureVideo);

        Lecture lecture = lectureDao.findById(lectureId).orElseThrow(() -> new RuntimeException("Lecture not found for id: " + lectureId));

        // set the lectureVideo in Lecture entity
        lecture.setLectureVideo(lectureVideo);

        // Save the Lecture entity with the updated lectureVideo
        lectureDao.save(lecture);

        return lecture;
    }


    public void deleteObject(String objectKey) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build());
    }


}
//    private static String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";
/*    public UploadResponse uploadProfileFile(MultipartFile file) {

        // Normalize file name
        String fileName = UUID.randomUUID().toString() + "." + file.getOriginalFilename().split("\\.")[1];

        try {
            Path uploadDirPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadDirPath);
            // Copy file to the target location (Replacing existing file with the same name)
            Path filePath = uploadDirPath.resolve(fileName).normalize();
            System.out.println("...........$$$$$$$filePath$$." + filePath);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Build the file URL.
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            System.out.println("...........$$$fileUrl$$$$$$$." + fileUrl);

            return new UploadResponse(true, 200, "profile picture has been successfully uploaded", fileUrl );
        } catch (IOException e) {
            System.out.println("Error uploading file: " + e.getMessage());
            return new UploadResponse(false, 400, "Failed to upload profile picture: " + e.getMessage(), null);
        }
    }*/


