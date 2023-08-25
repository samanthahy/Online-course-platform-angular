import {ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {Course} from "../shared/models/course";
import {CurrencyService} from "../shared/services/currency.service";
import {CourseService} from "../shared/services/course.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {forkJoin, map, Subject, switchMap, takeUntil, tap} from "rxjs";
import {UserInfo} from "../shared/models/user-info";
import {UserInfoService} from "../shared/services/user-info.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";


interface FilterItem {
  id: number;
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})

export class CoursesComponent implements OnInit {



  ratings: any = [
      {id: 1, name: "Excellent", value: 4.5},
      {id: 2, name: "Good", value: 4.0},
      {id: 3, name: "Fair", value: 3.5}
    ];

/*
    topics: any = ["Python", "Java", "C#", "React JS", "C++", "JavaScript",
                    "C", "Go", "Angular", "CSS", "Node.Js", "Typescript",
                    "Machine Learning", "ChatGPT", "TensorFlow", "System Design", "DevOps"];
*/


  topics = [
    {name: "Python", checked: false},
    {name: "Java", checked: false},
    {name: "C#", checked: false},
    {name: "React JS", checked: false},
    {name: "C++", checked: false},
    {name: "JavaScript", checked: false},
    {name: "C", checked: false},
    {name: "Go", checked: false},
    {name: "Angular", checked: false},
    {name: "CSS", checked: false},
    {name: "Node.Js", checked: false},
    {name: "Typescript", checked: false},
    {name: "Machine Learning", checked: false},
    {name: "ChatGPT", checked: false},
    {name: "TensorFlow", checked: false},
    {name: "System Design", checked: false},
    {name: "DevOps", checked: false}
  ];


  categories = [
      {id: 1, path:'Development.Programming_Language.Python', name: "Python"},
      {id: 2, path:'Development.Programming_Language.Java', name: "Java"},
      {id: 3, path:'Development.Programming_Language.Csharp', name: "C#"},
      {id: 4, path:'Development.Programming_Language.ReactJS', name: "React JS"},
      {id: 5, path:'Development.Programming_Language.Cplusplus', name: "C++"},
      {id: 6, path:'Development.Programming_Language.JavaScript', name: "JavaScript"},
      {id: 7, path:'Development.Programming_Language.C', name: "C"},
      {id: 8, path:'Development.Programming_Language.Go', name: "Go"},
      {id: 9, path:'Development.Web_Development.Angular', name: "Angular"},
      {id: 10, path:'Development.Web_Development.CSS', name: "CSS"},
      {id: 11, path:'Development.Web_Development.NodeJS', name: "Node.Js"},
      {id: 12, path:'Development.Web_Development.Typescript', name: "Typescript"},
      {id: 13, path:'Development.Data_Science.Machine_Learning', name: "Machine Learning"},
      {id: 14, path:'Development.Data_Science.ChatGPT', name: "ChatGPT"},
      {id: 15, path:'Development.Data_Science.TensorFlow', name: "TensorFlow"},
      {id: 16, path:'IT_Software.Other_IT_Software.System_Design', name: "System Design"},
      {id: 17, path:'IT_Software.Other_IT_Software.DevOps', name: "DevOps"}
    ]
  levels: FilterItem[] = [
    {id: 1, name: "Beginner", checked: false},
    {id: 2, name: "Intermediate", checked: false},
    {id: 3, name: "Expert", checked: false},
    {id: 4, name: "All level", checked: false}
  ];

  languages: FilterItem[] = [
    {id: 1, name: "English", checked: false},
    {id: 2, name: "Chinese", checked: false},
    {id: 3, name: "Spanish", checked: false}
  ];

  prices: FilterItem[] = [
    {id: 1, name: "Paid", checked: false},
    {id: 2, name: "Free", checked: false}
  ];


  courses: Course [] | undefined;
  courseTitle: string = 'All courses';
  totalFilteredCourses: number = 0;

  searchTerm: string = '';
  selectedRating: number = 0;
  levelFilter: any[] = [];
  topicFilter: any[] = [];
  languageFilter: any[] = [];
  priceFilter: any[] = [];
  displayedCourses: Course[] = [];
  private destroyed$ = new Subject<void>();


  instructorUserInfoMap = new Map<number, UserInfo>();
  coursesDataSource = new MatTableDataSource<Course>([]);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(
    private courseService: CourseService,
    private uis: UserInfoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.courseService.searchTermChanged.subscribe(term => {
      this.searchTerm = term;
      console.log("Updated Search Term:", this.searchTerm);
      this.updateCoursesWithFilters(); // apply filters after updating the search term
    });

  }




  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const category = params['category'];
          const subcategory = params['subcategory'];
          const topic = params['topic'];

          // Determine the title based on the route params
          if (topic) {
            const topicName = this.getNameByPath(`${topic}`);
            this.courseTitle = topicName ? `${topicName} Courses` : 'All Courses';
          } else if (subcategory) {
            this.courseTitle = this.capitalizeWords(subcategory) + ' Courses';
          } else if (category) {
            this.courseTitle = this.capitalizeWords(category) + ' Courses';
          } else {
            this.courseTitle = "All courses";
          }
          this.cdr.detectChanges();


          return this.courseService.getCourses()
            .pipe(
              map(courses => courses.filter(course => course.status === 'Published')),
              switchMap(courses => {
                const userInfoRequests = courses.map(course => this.uis.getUserInfoByUserId(course.instructor.id));
                return forkJoin(userInfoRequests).pipe(
                  tap(userInfos => {
                    userInfos.forEach((userInfo, index) => {
                      this.instructorUserInfoMap.set(courses[index].instructor.id, userInfo);
                    });
                  }),
                  map(() => {
                    if (category || subcategory || topic) {
                      return courses.filter(course => {
                        const pathParts = course.category.path.split(".");
                        const fetchedCategory = pathParts[0].toLowerCase().replace(/_/g, "-");
                        const fetchedSubcategory = pathParts[1].toLowerCase().replace(/_/g, "-");
                        const fetchedTopic = pathParts[2].toLowerCase().replace(/_/g, "-");
                        if (subcategory) {
                          return fetchedCategory === category && fetchedSubcategory === subcategory;
                        } else if (category) {
                          return fetchedCategory === category;
                        } else if (topic) {
                          return fetchedTopic === topic;
                        }
                        return true;  // By default, if no filters are given, show all courses.
                      });
                    }
                    return courses;
                  })
                );
              })
            );
        })
      )
      .subscribe(courses => {
        this.courses = courses;
        this.courseService.courses = courses;

        // step 1: reset the paginator
        this.paginator.firstPage();

        // step 2: Update data source with courses
        this.coursesDataSource.data = courses;
        this.paginator.length = courses.length;

        // step 3: update displayed courses after filtering
        this.updateDisplayedCourses();
      });
  }








  ngAfterViewInit() {
    this.coursesDataSource.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.updateDisplayedCourses();
    });
  }





  updateDisplayedCourses() {
    this.displayedCourses = this.getCurrentPageData();
    console.log("Paginator:", this.paginator.pageIndex, this.paginator.pageSize, this.paginator.length);
  }


  getCurrentPageData(): Course[] {
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    return this.coursesDataSource.data.slice(start, end);
  }

  clearAllFilters(): void {
    this.selectedRating = 0;

    this.topicFilter = [];
    this.topics.forEach(t => t.checked = false);

    this.levelFilter = [];
    this.levels.forEach(l => l.checked = false);

    this.languageFilter = [];
    this.languages.forEach(l => l.checked = false);

    this.priceFilter = [];
    this.prices.forEach(p => p.checked = false);

    // Update the courses list based on the cleared filters
    this.updateCoursesWithFilters();
  }




  getNameByPath(searchPath: string): string | null {
    const category = this.categories.find(cat => cat.path.split('.')[2].toLowerCase().replace(/_/g,'-') === searchPath);
    return category ? category.name : null;
  }


  capitalizeWords(str: string): string {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }





  getCourseCountForRating(rating: number): number {
    if (!this.courses) return 0;
    let filteredCourses = this.applyCommonFilters(this.courses, false); // false indicates not to apply the rating filter
    return filteredCourses.filter(course => course.rating >= rating).length;
  }


  getCourseCountForTopic(topic: string): number {
    if (!this.courses) return 0;
    const filteredCourses = this.applyCommonFilters(this.courses);
    return filteredCourses.filter(course => course.category.name === topic).length;
  }


  applyCommonFilters(courses: Course[], applyRating: boolean = true): Course[] {
    let filteredCourses = [...courses];


    // Apply search term filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();

      filteredCourses = filteredCourses.filter(course => {
        let instructor = this.instructorUserInfoMap.get(course.instructor.id);
        let instructorFirstName = instructor ? instructor.firstname : '';
        let instructorLastName = instructor ? instructor.lastname : '';

        return course.name.toLowerCase().includes(searchTermLower) ||
          (course.description && course.description.toLowerCase().includes(searchTermLower)) ||
          (course.overview && course.overview.toLowerCase().includes(searchTermLower)) ||
          (course.learningOutcomes && course.learningOutcomes.toLowerCase().includes(searchTermLower)) ||
          (course.prerequisites && course.prerequisites.toLowerCase().includes(searchTermLower)) ||
          (instructorFirstName && instructorFirstName.toLowerCase().includes(searchTermLower)) ||
          (instructorLastName && instructorLastName.toLowerCase().includes(searchTermLower));
      });
    }

    // Apply rating filter only if applyRating is true
    if (applyRating && this.selectedRating) {
      filteredCourses = filteredCourses.filter(course => course.rating >= this.selectedRating);
    }

    // Apply topic filter
    if (this.topicFilter && this.topicFilter.length) {
      filteredCourses = filteredCourses.filter(course => this.topicFilter.includes(course.category.name));
    }

    // Apply level filter
    if (this.levelFilter.length) {
      filteredCourses = filteredCourses.filter(course => this.levelFilter.includes(course.level));
    }


    // Apply language filter
    if (this.languageFilter.length) {
      filteredCourses = filteredCourses.filter(course => this.languageFilter.includes(course.language));
    }

    // Apply price filter
    if (this.priceFilter.length) {
      filteredCourses = filteredCourses.filter(course => {
        const isFree = course.price === 0;
        const isPaid = course.price > 0;
        return this.priceFilter.some(filter => (isFree && filter === 'Free') || (isPaid && filter === 'Paid'));
      });
    }

    return filteredCourses;
  }






  // used for pagination
  updateCoursesWithFilters() {
    if (this.courses) {
      const filteredCourses = this.applyCommonFilters(this.courses);
      this.coursesDataSource.data = filteredCourses;
      this.totalFilteredCourses = filteredCourses.length;

      // console.log('Total Filtered Courses:', this.totalFilteredCourses);

      this.paginator.length = this.totalFilteredCourses; // update paginator length

      this.paginator.firstPage();
      this.updateDisplayedCourses();
    }
  }




  onRatingChange(): void {
    this.updateCoursesWithFilters();
  }


  onTopicChange(topic: {name: string, checked: boolean}, $event:MatCheckboxChange) {
    topic.checked = $event.checked;
    this.topicFilter = this.updateFilterArray(this.topicFilter, topic.name, topic.checked);
    this.updateCoursesWithFilters();
  }

  onLevelChange(level: {id: number, name: string, checked: boolean}, $event:MatCheckboxChange) {
    level.checked = $event.checked;
    this.levelFilter = this.updateFilterArray(this.levelFilter, level.name, level.checked);
    this.updateCoursesWithFilters();
  }

  onLanguageChange(language: {id: number, name: string, checked: boolean}, $event:MatCheckboxChange) {
    language.checked = $event.checked;
    this.languageFilter = this.updateFilterArray(this.languageFilter, language.name, language.checked);
    this.updateCoursesWithFilters();
  }

  onPriceChange(price: {id: number, name: string, checked: boolean}, $event:MatCheckboxChange) {
    price.checked = $event.checked;
    this.priceFilter = this.updateFilterArray(this.priceFilter, price.name, price.checked);
    this.updateCoursesWithFilters();
  }

// Generic function to update filter arrays
  // Generic function to update filter arrays
  updateFilterArray(filterArray: string[], value: string, isChecked: boolean): string[] {
    if (isChecked) {
      return [...filterArray, value];
    } else {
      return filterArray.filter(item => item !== value);
    }
  }


}
