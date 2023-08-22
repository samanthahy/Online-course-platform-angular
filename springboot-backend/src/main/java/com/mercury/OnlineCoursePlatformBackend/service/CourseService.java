package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.dao.*;
import com.mercury.OnlineCoursePlatformBackend.http.request.CreateCourseRequest;
import com.mercury.OnlineCoursePlatformBackend.http.request.UpdateCourseBasicRequest;
import com.mercury.OnlineCoursePlatformBackend.http.request.UpdateCourseGoalsRequest;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;



@Service
public class CourseService {
    @Autowired
    private CourseDao courseDao;

    @Autowired
    private UserInfoDao userInfoDao;

    @Autowired
    private EnrollmentDao enrollmentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private SectionDao sectionDao;

    @Autowired
    private LectureDao lectureDao;


    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private S3Service s3Service;


    @PersistenceContext
    private EntityManager em;



    public void save(Course course) {
        courseDao.save(course);
    }

    public Course getCourseById(Integer id) {

        Optional<Course> c = courseDao.findById(id);
        if(c.isPresent()) {
            // Access the collection within the transaction, forcing it to be fetched
//            c.get().getLearningOutcomes();
            return c.get();
        } else {
            return null;
        }
    }


    public Course getCourseByName(String name) {
        return courseDao.findByName(name);
    }

    public List<Course> getAll() {
        return courseDao.findAll();
    }


    public List<Course> getCourseByInstructor(int instructorId) {
        return courseDao.findByInstructor_Id(instructorId);
    }


    public Course createNewCourse(CreateCourseRequest createCourseRequest) {
        Course course = new Course();
        User instructor = userDao.findById(createCourseRequest.getInstructorId()).orElseThrow();
        course.setInstructor(instructor);
        course.setStatus(createCourseRequest.getStatus());
        return courseDao.save(course);
    }

    public Section createSection(int courseId, String sectionName) {
        Course dbCourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));

        Section section = new Section();
        section.setTitle(sectionName);
        section.setCourse(dbCourse);
        section.setLectures(new ArrayList<>());

        // Save the new section into the database
        return sectionDao.save(section);
    }

    public Lecture getLectureById(int lectureId) {

        Optional<Lecture> l = lectureDao.findById(lectureId);
        return l.orElse(null);
    }




    public Lecture createLecture(int sectionId, String lectureName, Duration duration) {
        Section dbSection = sectionDao.findById(sectionId).orElseThrow(() -> new RuntimeException("Section not found for id: " + sectionId));

        Lecture lecture= new Lecture();
        lecture.setTitle(lectureName);
        lecture.setDuration(duration);
        lecture.setSection(dbSection);

        // Save the new section into the database
        return lectureDao.save(lecture);
    }


    public Section editSectionName(int sectionId, String sectionName){
        Section dbSection = sectionDao.findById(sectionId).orElseThrow(() -> new RuntimeException("Section not found for id: " + sectionId));

        dbSection.setTitle(sectionName);
        return sectionDao.save(dbSection);
    }



    public Lecture editLectureName(int lectureId,  String lectureName) {
        Lecture dbLecture = lectureDao.findById(lectureId).orElseThrow(() -> new RuntimeException("Lecture not found for id: " + lectureId));

        dbLecture.setTitle(lectureName);
        return lectureDao.save(dbLecture);
    }



    public Course saveCourseGoals(UpdateCourseGoalsRequest updateCourseGoalsRequest, int courseId) {
        Course dbcourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));

        dbcourse.setLearningOutcomes(updateCourseGoalsRequest.getLearningOutcomes());
        dbcourse.setPrerequisites(updateCourseGoalsRequest.getPrerequisites());

        return courseDao.save(dbcourse);
    }



    public Course saveCourseBasics(UpdateCourseBasicRequest updateCourseBasicsRequest, int courseId) {
        Course dbcourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));

        dbcourse.setName(updateCourseBasicsRequest.getName());
        dbcourse.setOverview(updateCourseBasicsRequest.getOverview());
        dbcourse.setDescription(updateCourseBasicsRequest.getDescription());
        dbcourse.setLevel(updateCourseBasicsRequest.getLevel());
        dbcourse.setPrice(updateCourseBasicsRequest.getPrice());
        dbcourse.setLanguage(updateCourseBasicsRequest.getLanguage());

        String mainCategory = updateCourseBasicsRequest.getMainCategory();
        String subCategory = updateCourseBasicsRequest.getSubCategory();
        String courseTopic = updateCourseBasicsRequest.getCourseTopic();
        String path = mainCategory + '.' + subCategory + '.' + courseTopic;
        Category category = categoryDao.findByPath(path).orElseThrow(() -> new RuntimeException("Category not found for path: " + path));

        dbcourse.setCategory(category);
        dbcourse.setCourseImage(updateCourseBasicsRequest.getCourseImage());

        return courseDao.save(dbcourse);
    }


    public Response deleteLecture(int sectionId, int lectureId) {
        Section dbSection = sectionDao.findById(sectionId).orElseThrow(() -> new RuntimeException("Section not found for id: " + sectionId));
        Lecture dbLecture = lectureDao.findById(lectureId).orElseThrow(() -> new RuntimeException("Lecture not found for id: " + lectureId));

        dbSection.getLectures().remove(dbLecture);
        sectionDao.save(dbSection);
        lectureDao.deleteById(lectureId);
        return new Response(true, 200,"Successfully deleted lecture.");
    }

    @Transactional
    public Response deleteSection(int sectionId) {
        Section dbSection = sectionDao.findById(sectionId).orElseThrow(() -> new RuntimeException("Section not found for id: " + sectionId));

        // Delete all lectures in the section
        for(Lecture lecture : dbSection.getLectures()) {
            if(lecture.getLectureVideo().getS3ObjectKey() != null) {
                // Delete the video from S3
                s3Service.deleteObject(lecture.getLectureVideo().getS3ObjectKey());
            }
            // Delete the lecture from the database
            lectureDao.deleteById(lecture.getId());
        }
        dbSection.getCourse().getSectionList().remove(dbSection);
        // Delete the section from the database
        sectionDao.deleteById(sectionId);
        return new Response(true, 200,"Successfully deleted lecture.");
    }

    public Response changeCourseStatus(String status, int courseId) {
        Course dbCourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));
        dbCourse.setStatus(status);
        courseDao.save(dbCourse);
        return new Response(true);
    }




    public List<Course> findRandomCourses() {
        List<Integer> validCourseIds = courseDao.findIdsByStatus("Published");
        Collections.shuffle(validCourseIds);

        // Select the first three after shuffle
        List<Integer> randomSelectedIds = validCourseIds.subList(0, Math.min(3, validCourseIds.size()));

        List<Course> randomCourses = courseDao.findAllById(randomSelectedIds);

        return randomCourses;



    }




    public ByteArrayInputStream getCoursesInPDF() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfPTable table = new PdfPTable(5);

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            PdfPCell hcell;
            hcell = new PdfPCell(new Phrase("ID", headFont));
            hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(hcell);
            hcell = new PdfPCell(new Phrase("Name", headFont));
            hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(hcell);
            hcell = new PdfPCell(new Phrase("Brand", headFont));
            hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(hcell);
            hcell = new PdfPCell(new Phrase("Price", headFont));
            hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(hcell);
            hcell = new PdfPCell(new Phrase("Stock", headFont));
            hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(hcell);

            // pd.save(p);	// oracle
            // fd.save(f);	// mySQL

            // exception below:
            for(Course c : courseDao.findAll()) {
                PdfPCell cell;

                cell = new PdfPCell(new Phrase(Integer.toString(c.getId())));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(c.getName()));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(userInfoDao.findByUserId(c.getInstructor().getId()).getFirstname() + userInfoDao.findByUserId(c.getInstructor().getId()).getLastname() ));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(c.getOverview()));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(Double.toString(c.getRating())));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(c.getCategory().toString()));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(c.getLevel()));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(Double.toString(c.getPrice())));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(Integer.toString(c.getDiscount())));
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            PdfWriter.getInstance(document, out);
            document.open();
            document.add(table);
        } catch (DocumentException e) {
            e.printStackTrace();
        } finally {
            document.close();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }


}
