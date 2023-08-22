import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Course} from "../../../shared/models/course";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {CourseService} from "../../../shared/services/course.service";
import {ActivatedRoute} from "@angular/router";
import {startWith} from "rxjs";
import tinymce from "tinymce";
import {S3Service} from "../../../shared/services/s3.service";
import {CourseImage} from "../../../shared/models/course-image";

@Component({
  selector: 'app-basics',
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss']
})
export class BasicsComponent implements OnInit{

  @Output() onComplete = new EventEmitter<void>();

  courseId: number;
  course: Course;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  subCategories: string[] = [];
  courseTopics : string[] = [];



  form: FormGroup = this.fb.group({
    courseTitle: ['', Validators.required], // Here the empty string represents the initial value
    courseSubtitle: ['', Validators.required],
    courseDescription: ['', Validators.required],
    basicInfo: this.fb.group({
      courseLanguage: ['', Validators.required],
      courseLevel: ['', Validators.required],
      courseCategory: this.fb.group({
        mainCategory: ['', Validators.required],
        subCategory: ['', Validators.required],
      })
    }),
    courseTopic: ['', Validators.required],
    courseImage: [''],
    coursePrice: ['', Validators.required]
  });



  constructor(private fb: FormBuilder,
              private cs: CourseService,
              private s3Service: S3Service,
              private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });
    this.cs.getCourseById(this.courseId).subscribe((course: Course) => {
      this.course = course;

      this.setFormValue(this.form.get('courseTitle'), course.name);
      this.setFormValue(this.form.get('courseSubtitle'), course.overview);
      this.setFormValue(this.form.get('courseDescription'), course.description);

      // Initialize TinyMCE with the HTML content
      tinymce.init({
        selector: '#tinyMceEditor',
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image',
        menubar: false,
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(course.description);
          });
          editor.on('change', () => {
            this.form.get('courseDescription')?.setValue(editor.getContent());
          });
        }
      });

      let basicInfoGroup = this.form.get('basicInfo') as FormGroup;

      this.setFormValue(basicInfoGroup.get('courseLanguage'), course.language);
      this.setFormValue(basicInfoGroup.get('courseLevel'), course.level);

      if (course.category && course.category.path) {
        let categories = course.category.path.split('.');
        let courseCategoryGroup = basicInfoGroup.get('courseCategory') as FormGroup;
        this.setFormValue(courseCategoryGroup.get('mainCategory'), categories[0].replace("_", " "));
        this.setFormValue(courseCategoryGroup.get('subCategory'), categories[1].replace("_", " "));
        this.setFormValue(this.form.get('courseTopic'), course.category.name);
      }

      // this.setFormValue(this.form.get('courseImage'), course.courseImage.filePath);
      this.setFormValue(this.form.get('coursePrice'), course.price);
      if (course.courseImage && course.courseImage.filePath) {
        this.imagePreview  = course.courseImage.filePath;
      }

      // Apply the custom validator here:
      let imageControl = this.form.get('courseImage');
      imageControl?.setValidators(this.imageValidator.bind(this)); // No Validators.required here
      imageControl?.updateValueAndValidity(); // This line will trigger validation


      this.form.get('basicInfo.courseCategory.mainCategory')?.valueChanges
        .pipe(startWith(this.form.get('basicInfo.courseCategory.mainCategory')?.value))
        .subscribe(mainCategory => {
          this.updateSubCategories(mainCategory);
        });

      this.form.get('basicInfo.courseCategory.subCategory')?.valueChanges
        .pipe(startWith(this.form.get('basicInfo.courseCategory.subCategory')?.value))
        .subscribe(subCategory => {
          this.updateTopics(subCategory);
        });

    });
  }

  ngOnDestroy(): void {
    tinymce.remove('#tinyMceEditor');
  }

  updateSubCategories(mainCategory: string) {
    console.log("updateSubCategory calls");
    if (mainCategory === 'Development') {
      this.subCategories = ['Web Development', 'Programming Language','Data Science'];
    } else if (mainCategory === 'IT Software') {
      this.subCategories = ['Other IT Software'];
    } else {
      this.subCategories = [];
    }
    // this.form.get('basicInfo.courseCategory.subCategory')?.reset(); // Reset the value of subCategory control

  }


  updateTopics(subCategory: string) {
    console.log("updateTopics calls");
    if (subCategory === 'Programming Language') {
      this.courseTopics = ['Python', 'Java','C#', 'React JS', 'C++', 'JavaScript', 'C', 'Go'];
    } else if (subCategory === 'Web Development') {
      this.courseTopics = ['Angular', 'CSS', 'Node.Js', 'Typescript'];
    } else if (subCategory === 'Data Science') {
      this.courseTopics = ['Machine Learning', 'ChatGPT','TensorFlow'];
    } else if (subCategory === 'Other IT Software') {
      this.courseTopics = ['System Design', 'DevOps'];
    } else {
      this.courseTopics = [];
    }
    // this.form.get('courseTopic')?.reset(); // Reset the value of subCategory control

  }

  setFormValue(control: AbstractControl | null, value: any) {
    if (control) {
      control.setValue(value);
    }
  }


  OnFileSelected(files: FileList | null) {
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.setFormValue(this.form.get('courseImage'), this.selectedFile.name);
    }
  }



  imageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (this.imagePreview || control.value) {
      return null; // all good, return no error
    } else {
      return { 'noImage': { value: control.value } }; // return an error object if no image is present
    }
  }



  submit() {
    console.log("submit calls");
    if (this.form.invalid) {
      // Log the specific form errors
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors: ValidationErrors | null | undefined = this.form.get(key)?.errors;
        if (controlErrors) { // Check if controlErrors is truthy
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ' + controlErrors[keyError]);
          });
        }
      });

      // If form is not valid, return or show an error message
      return;
    }
/*    if (this.form.invalid) {
      // If form is not valid, return or show an error message
      return;
    }*/

    if (this.selectedFile) {
      // Upload the image file and get the 'courseImage' instance
      this.s3Service.uploadCourseImage(this.selectedFile, this.course.id).subscribe((courseImage) => {
        // Use the 'courseImage' instance to update the course
        this.updateCourse(courseImage);
      });
    } else {
      // If no new image file, use the original 'courseImage' data
      this.updateCourse(this.course.courseImage);
    }
  }

  updateCourse(courseImage: CourseImage) {
    // Prepare the data for updating the course
    const courseData = {
      name: this.form.get('courseTitle')?.value,
      overview: this.form.get('courseSubtitle')?.value,
      description: this.form.get('courseDescription')?.value,
      level: this.form.get('basicInfo.courseLevel')?.value,
      price: this.form.get('coursePrice')?.value,
      language: this.form.get('basicInfo.courseLanguage')?.value,
      mainCategory: this.form.get('basicInfo.courseCategory.mainCategory')?.value,
      subCategory: this.form.get('basicInfo.courseCategory.subCategory')?.value,
      courseTopic: this.form.get('courseTopic')?.value,
      courseImage: courseImage
    };

    this.cs.updateCourseBasics(this.courseId, courseData).subscribe((updatedCourse) => {
      this.imagePreview = updatedCourse.courseImage.filePath;
      this.form.get('courseTitle')?.setValue(updatedCourse.name);
      this.form.get('courseSubtitle')?.setValue(updatedCourse.overview);
      this.form.get('courseDescription')?.setValue(updatedCourse.description); // Fixed: changed from .name to .description
      this.form.get('basicInfo.courseLevel')?.setValue(updatedCourse.level);
      this.form.get('basicInfo.courseLanguage')?.setValue(updatedCourse.language);
      this.form.get('coursePrice')?.setValue(updatedCourse.price);

      let categories = updatedCourse.category.path.split('.');
      this.form.get('basicInfo.courseCategory.mainCategory')?.setValue(categories[0].replace("_", " "));
      this.form.get('basicInfo.courseCategory.subCategory')?.setValue(categories[1].replace("_", " ")); // Fixed: changed to set subCategory
      this.form.get('courseTopic')?.setValue(updatedCourse.category.name); // Fixed: changed from courseTitle to courseTopic
    }, (error) => {
      console.error('An error occurred while updating the course basics:', error.message);
    });
    this.onComplete.emit();
  }

}
