import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../../shared/services/course.service";
import {S3Service} from "../../../shared/services/s3.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Course} from "../../../shared/models/course";
import {Section} from "../../../shared/models/section";
import {Lecture} from "../../../shared/models/lecture";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent implements OnInit {
  @Output() onComplete = new EventEmitter<void>();


  form = this.fb.group({
    sections: this.fb.array([])
  });


  courseId: number;
  editMode: boolean = false;

  /*  display: FormControl = new FormControl("", Validators.required);
    selectedFile: File | null = null;*/

  selectedFiles: Map<FormGroup, File> = new Map();
  displayTexts: Map<FormGroup, FormControl> = new Map();

  progress = new Map<FormGroup, number>();
  isLoading = new Map<FormGroup, boolean>();

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private cs: CourseService,
              private s3Service: S3Service,
              private cd: ChangeDetectorRef,
              private snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });
    this.cs.getCourseById(this.courseId).subscribe((course: Course) => {
      // Remove the initial sections.
      this.sections.clear();

      // For each section in the data, add a section FormGroup to the form.
      for (let section of course.sectionList) {
        let mapLectures = section.lectures.map(lecture => this.createLecture(lecture));
        let newSection = this.createSection({id: section.id, sectionName: section.title, lectures: mapLectures})
        this.sections.push(newSection);
      }
    });
  }

  onFinalize() {
    this.onComplete.emit();
  }

  createSection(sectionData: any = {}): FormGroup {
    const lecturesArray = sectionData.lectures || [];
    return this.fb.group({
      id: [sectionData.id || null],
      sectionName: [sectionData.sectionName || ''],
      lectures: this.fb.array(lecturesArray),
      editMode: [sectionData.sectionName === '']
    });
  }


  createLecture(lectureData: any = {}): FormGroup {
    const lecture = this.fb.group({
      id: [lectureData.id || null],
      lectureName: [lectureData.title || ''],
      editMode:  [lectureData.title === undefined],
      videoUrl: [lectureData.lectureVideo?.filePath || ''],  // Store video file here. You might need to handle this differently.
      duration: [lectureData.duration || ''],
      isPanelOpen: [false],
      isPanelInteracted: [false]
    });
    this.displayTexts.set(lecture, new FormControl("", Validators.required));
    return lecture;
  }


// Function to add a new section FormGroup to the sections FormArray
  addSection(sectionData: any = {}): void {
    const isFirstSection = this.sections.controls.length === 0;
    const sectionName = isFirstSection && !sectionData.sectionName ? 'Introduction' : sectionData.sectionName || '';
    const section = this.createSection({ ...sectionData, sectionName });
    this.sections.push(section);
    if (isFirstSection && (!sectionData.lectures || sectionData.lectures.length === 0)) {
      this.addLecture(0);
    }
  }

// Function to add a new lecture FormGroup to a section's lectures FormArray
  addLecture(sectionIndex: number, lectureData: any = {}): void {
    const isFirstLecture = this.getLectures(this.sections.at(sectionIndex) as FormGroup).length === 0;
    const lectureName = isFirstLecture && !lectureData.lectureName ? 'Introduction' : lectureData.lectureName || '';
    const lecture = this.createLecture({ ...lectureData, lectureName });
    this.getLectures(this.sections.at(sectionIndex) as FormGroup).push(lecture);
  }



  openPanel(lecture: FormGroup) {
    // Open the panel
    lecture.get('isPanelOpen')?.setValue(true);

    // Check if a file has been selected for this lecture
    if (this.selectedFiles.has(lecture)) {
      // A file has been selected, so we remove the required validator
      this.displayTexts.get(lecture)?.clearValidators();
    } else {
      // No file has been selected, so we set the required validator
      this.displayTexts.get(lecture)?.setValidators(Validators.required);
    }

    // Update the validity of the form control
    this.displayTexts.get(lecture)?.updateValueAndValidity();
  }


  // Getter for convenience to get sections
  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }


  // Fetch sections and lectures from the backend and fill the form
  getLectures(section: FormGroup): FormArray {
    return section.get('lectures') as FormArray;
  }


  toggleEditMode(control: AbstractControl): void {
    const isEditMode = control.get('editMode')?.value;
    control.get('editMode')?.setValue(!isEditMode);
    console.log(control.get('editMode')?.value);
  }


  editSectionName(control: AbstractControl): void {
    if (control.get('editMode')?.value && control.get('sectionName')?.value !== '' && control.get('id')?.value) {
      const newName = control.get('sectionName')?.value;
      const sectionId = control.get('id')?.value;
      this.cs.editSectionName(newName, sectionId).subscribe(
        (updatedSection) => {
          control.get('sectionName')?.setValue(updatedSection.title);
        },
        error => {
          console.log("Failed to edit section name", error);
        }
      );
    }
    this.toggleEditMode(control);
  }


  editLectureName(control: AbstractControl): void {
    if (control.get('editMode')?.value && control.get('lectureName')?.value !== '' && control.get('id')?.value) {
      const newName = control.get('lectureName')?.value;
      const lectureId = control.get('id')?.value;
      this.cs.editLectureName(newName, lectureId).subscribe(
        (updatedLecture) => {
          control.get('lectureName')?.setValue(updatedLecture.title);
        },
        error => {
          console.log("Failed to edit lecture name", error);
        }
      );
    }
    this.toggleEditMode(control);
  }



  confirmDeleteSection(sectionIndex: number): void {
    if (confirm('Please confirm: You are about to remove a curriculum item. Are you sure you want to continue?')) {
      const section = this.sections.at(sectionIndex) as FormGroup;

      if (section.get('id')?.value) {
        this.cs.deleteSection(section.get('id')?.value).subscribe(
          () => {
            // Remove section from form array
            this.sections.removeAt(sectionIndex);
          },
          error => {
            console.log("Failed to delete section", error);
          }
        );
      } else {
        // The section hasn't been saved in the database yet
        // So we just need to remove it from the form array
        this.sections.removeAt(sectionIndex);
      }
    }
  }

  confirmDeleteLecture(sectionIndex: number, lectureIndex: number): void {
    if (confirm('Please confirm: You are about to remove a curriculum item. Are you sure you want to continue?')) {
      const section = this.sections.at(sectionIndex) as FormGroup;
      const lecture = this.getLectures(section).at(lectureIndex) as FormGroup;

      if (lecture.get('videoUrl')?.value!== "") {
        // The lecture has been saved in the database
        this.cs.deleteLecture(section.get('id')?.value, lecture.get('id')?.value).subscribe(
          () => {
            // If deletion is successful, remove it from the form array
            this.getLectures(section).removeAt(lectureIndex);
          },
          error => {
            console.log("Failed to delete existing lecture video error", error);
          }
        );
      } else {
        // The lecture hasn't been saved in the database yet
        // So we just need to remove it from the form array
        this.getLectures(section).removeAt(lectureIndex);
      }
    }
  }


  clearSelection(lecture: FormGroup) {
    this.selectedFiles.delete(lecture);
    this.displayTexts.get(lecture)?.setValue(''); // Or any placeholder you want to show when no file is selected
  }


  onFileSelected(lecture: FormGroup, file: File) {
    if (!file) {
      return
    }
    this.selectedFiles.set(lecture, file);
    this.displayTexts.get(lecture)?.setValue(file.name);  // Or whatever you want to display when a file is selected
  }

  getOnFileSelectedFunction(lecture: FormGroup) {
    return (files: FileList | null) => {
      if (files && files.length > 0) {
        this.onFileSelected(lecture, files[0]);
      }
    };
  }

  handleSubmit() {
    console.log("handleSubmit called");
    for(let sectionGroup of (this.sections.controls as FormGroup[])) {
      // If the section is newly created
      if (!sectionGroup.get('id')?.value) {
        // Create the section in the backend
        this.cs.createSection(this.courseId,
          sectionGroup.get('sectionName')?.value
        ).subscribe((section: Section) => {
          sectionGroup.get('id')?.setValue(section.id);  // Update the section id
          const lecturesGroup = sectionGroup.get('lectures') as FormArray;
          this.processLectures(section, lecturesGroup, sectionGroup);
        });
      } else {
        const lecturesGroup = sectionGroup.get('lectures') as FormArray;
        this.processLectures(sectionGroup.value, lecturesGroup, sectionGroup);
      }
    }
  }


  processLectures(section: Section, lecturesGroup: FormArray, sectionGroup: FormGroup) {
    console.log("processLectures called");
    for(let lectureGroup of (lecturesGroup.controls as FormGroup[])) {
      if(this.selectedFiles.has(lectureGroup)) {
        const file: File | undefined = this.selectedFiles.get(lectureGroup);

        if(file) {
          // Create an object URL for the selected file
          let url = URL.createObjectURL(file);

          // Load the video
          let video = document.createElement('video');
          video.src = url;
          video.load();

          // When the metadata has been loaded, set the duration
          video.onloadedmetadata = () => {
            let duration = video.duration;

            this.isLoading.set(lectureGroup, true);  // Set loading to true before beginning the upload
            console.log(this.isLoading);
            this.cd.detectChanges();

            // Create the lecture in the backend
            this.cs.createLecture(section.id!,
              lectureGroup.get('lectureName')?.value, duration) // pass the duration to backend
              .subscribe((lecture: Lecture) => {
                lectureGroup.get('id')?.setValue(lecture.id);  // Update the lecture id
                lectureGroup.get('duration')?.setValue(lecture.duration);  // Update the lecture duration
                // If there is a selected file for this lecture
                // Upload the file to S3 and update the lecture with the file data
                let snackBarRef = this.snackBar.open('Your file is being processed...');

                this.s3Service.uploadLectureVideo(file, lecture.id!)
                  .subscribe((event: HttpEvent<Lecture>) => {
                    // If the event is an HttpUploadProgressEvent, update the progress value
                    if (event.type === HttpEventType.UploadProgress) {
                      if (event.total) {
                        this.progress.set(lectureGroup, Math.round(100 * event.loaded / event.total));
                      }
                    } else if (event instanceof HttpResponse) {
                      // When the upload is complete, update the lectureGroup values
                      let lecture = event.body;
                      lectureGroup.get('videoUrl')?.setValue(lecture?.lectureVideo.filePath);
                      this.isLoading.set(lectureGroup, false); // Set loading to false after upload completes
                      // After updating the value, manually trigger change detection
                      this.cd.detectChanges();

                      // Remove the lectureGroup from this.selectedFiles
                      this.selectedFiles.delete(lectureGroup);
                      snackBarRef.dismiss();
                    }
                  });
              });
          };
        }
      }
    }
  }


  isFieldTouchedAndInvalid(lecture: FormGroup): boolean {
    const panelInteracted = lecture.get('isPanelInteracted')?.value;
    const displayControl = this.displayTexts.get(lecture);
    return panelInteracted && displayControl?.touched && displayControl?.invalid;
  }






  convertDuration(duration: string): string {
    // extract hours, minutes and seconds
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+)S/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;

    // calculate total minutes and seconds
    const totalMinutes = hours * 60 + minutes;
    const paddedMinutes = String(totalMinutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
  }



  toIterable(formArray: FormArray): FormGroup[] {
    return formArray.controls as FormGroup[];
  }

  togglePanel(lecture: FormGroup) {
    console.log("togglePanel called ")
    const currentValue = lecture.get('isPanelOpen')?.value;
    lecture.get('isPanelOpen')?.setValue(!currentValue);
  }

  formComplete() {
    this.onComplete.emit();
  }
}
